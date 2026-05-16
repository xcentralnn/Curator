package controller

import (
	"bytes"
	"context"
	"encoding/json"
	"fmt"
	"net/http"
	"time"

	"k8s.io/apimachinery/pkg/api/errors"
	metav1 "k8s.io/apimachinery/pkg/apis/meta/v1"
	"k8s.io/apimachinery/pkg/apis/meta/v1/unstructured"
	"k8s.io/apimachinery/pkg/runtime"
	"k8s.io/apimachinery/pkg/runtime/schema"
	"k8s.io/apimachinery/pkg/types"
	ctrl "sigs.k8s.io/controller-runtime"
	"sigs.k8s.io/controller-runtime/pkg/client"
	"sigs.k8s.io/controller-runtime/pkg/log"

	curatorv1alpha1 "curator/api/v1alpha1"
)

// CuratorScalerReconciler reconciles a CuratorScaler object
type CuratorScalerReconciler struct {
	client.Client
	Scheme *runtime.Scheme
}

type MLEngineRequest struct {
	PromQLQuery     string `json:"promQLQuery"`
	MetricType      string `json:"metricType"`
	CurrentReplicas int32  `json:"currentReplicas"`
}

type MLEngineResponse struct {
	RecommendedReplicas int32 `json:"recommendedReplicas"`
}

//+kubebuilder:rbac:groups=curator.io,resources=curatorscalers,verbs=get;list;watch;create;update;patch;delete
//+kubebuilder:rbac:groups=curator.io,resources=curatorscalers/status,verbs=get;update;patch
//+kubebuilder:rbac:groups=curator.io,resources=curatorscalers/finalizers,verbs=update

func (r *CuratorScalerReconciler) Reconcile(ctx context.Context, req ctrl.Request) (ctrl.Result, error) {
	logger := log.FromContext(ctx)

	// Fetch the CuratorScaler instance
	var scaler curatorv1alpha1.CuratorScaler
	if err := r.Get(ctx, req.NamespacedName, &scaler); err != nil {
		if errors.IsNotFound(err) {
			logger.Info("CuratorScaler resource not found. Ignoring since object must be deleted.")
			return ctrl.Result{}, nil
		}
		logger.Error(err, "Failed to get CuratorScaler")
		return ctrl.Result{}, err
	}

	// Fetch the target resource dynamically via unstructured
	targetRef := scaler.Spec.ScaleTargetRef
	targetGVK := schema.GroupVersionKind{
		Group:   targetRef.Group,
		Version: "v1", // Default to v1, can be dynamic out-of-band depending on the environment
		Kind:    targetRef.Kind,
	}

	// Adjust for standard resources if needed for fallback
	if targetRef.Group == "apps" {
		targetGVK.Version = "v1"
	}

	targetWorkload := &unstructured.Unstructured{}
	targetWorkload.SetGroupVersionKind(targetGVK)
	err := r.Get(ctx, types.NamespacedName{Name: targetRef.Name, Namespace: scaler.Namespace}, targetWorkload)
	if err != nil {
		logger.Error(err, "Failed to get scale target", "Target", targetRef)
		return ctrl.Result{}, err
	}

	// Get current replicas from target
	currentReplicasInt64, found, err := unstructured.NestedInt64(targetWorkload.Object, "spec", "replicas")
	if err != nil || !found {
		logger.Error(err, "Failed to get original replicas from target spec")
		return ctrl.Result{}, err
	}
	currentReplicas := int32(currentReplicasInt64)

	// Ensure our local view of status is up to date
	scaler.Status.CurrentReplicas = currentReplicas

	// 1. Panic Mechanism
	if scaler.Status.PanicMode {
		logger.Info("Scaler is in PanicMode, scaling to MaxReplicas immediately", "MaxReplicas", scaler.Spec.MaxReplicas)

		if currentReplicas != scaler.Spec.MaxReplicas {
			err = r.scaleTargetWorkload(ctx, targetWorkload, scaler.Spec.MaxReplicas)
			if err != nil {
				logger.Error(err, "Failed to scale target workload during panic")
				return ctrl.Result{}, err
			}
			now := metav1.Now()
			scaler.Status.LastScaleTime = &now
		}

		scaler.Status.DesiredReplicas = scaler.Spec.MaxReplicas
		scaler.Status.CurrentState = "Panic"

		if statErr := r.Status().Update(ctx, &scaler); statErr != nil {
			logger.Error(statErr, "Failed to update status")
			return ctrl.Result{}, statErr
		}

		return ctrl.Result{RequeueAfter: 1 * time.Minute}, nil
	}

	// 2. Query ML Engine
	recommendedReplicas, err := r.queryMLEngine(ctx, scaler.Spec.PromQLQuery, scaler.Spec.MetricType, currentReplicas)
	if err != nil {
		logger.Error(err, "ML Engine failure, triggering fallback mechanism")

		fallbackReplicas := currentReplicas
		// Evaluate FallbackPolicy
		if scaler.Spec.FallbackPolicy == "Max" {
			fallbackReplicas = scaler.Spec.MaxReplicas
		} else if scaler.Spec.FallbackPolicy == "Min" {
			fallbackReplicas = scaler.Spec.MinReplicas
		}
		// If "Keep", it stays at currentReplicas

		if fallbackReplicas != currentReplicas {
			err = r.scaleTargetWorkload(ctx, targetWorkload, fallbackReplicas)
			if err != nil {
				logger.Error(err, "Failed to scale target during fallback")
				return ctrl.Result{}, err
			}
			now := metav1.Now()
			scaler.Status.LastScaleTime = &now
		}

		scaler.Status.DesiredReplicas = fallbackReplicas
		scaler.Status.CurrentState = "Fallback"
		if updateErr := r.Status().Update(ctx, &scaler); updateErr != nil {
			logger.Error(updateErr, "Failed to update status")
			return ctrl.Result{}, updateErr
		}

		// Fallback Requeue
		return ctrl.Result{RequeueAfter: 1 * time.Minute}, nil
	}

	// Apply limits to recommendation
	if recommendedReplicas < scaler.Spec.MinReplicas {
		recommendedReplicas = scaler.Spec.MinReplicas
	}
	if recommendedReplicas > scaler.Spec.MaxReplicas {
		recommendedReplicas = scaler.Spec.MaxReplicas
	}

	// 3. Flapping Prevention
	if recommendedReplicas < currentReplicas {
		if scaler.Status.LastScaleTime != nil && time.Since(scaler.Status.LastScaleTime.Time) < 300*time.Second {
			logger.Info("Skipping scale down to prevent flapping", "TimeSinceLastScale", time.Since(scaler.Status.LastScaleTime.Time).Round(time.Second))

			scaler.Status.DesiredReplicas = currentReplicas
			scaler.Status.CurrentState = "Normal"
			if err := r.Status().Update(ctx, &scaler); err != nil {
				logger.Error(err, "Failed to update status")
				return ctrl.Result{}, err
			}
			return ctrl.Result{RequeueAfter: 5 * time.Minute}, nil
		}
	}

	// 4. Update Target Workload if scaling is needed
	if recommendedReplicas != currentReplicas {
		logger.Info("Scaling target workload", "From", currentReplicas, "To", recommendedReplicas)
		err = r.scaleTargetWorkload(ctx, targetWorkload, recommendedReplicas)
		if err != nil {
			logger.Error(err, "Failed to scale target workload")
			return ctrl.Result{}, err
		}

		now := metav1.Now()
		scaler.Status.LastScaleTime = &now
	}

	// 5. Final Status Update
	scaler.Status.DesiredReplicas = recommendedReplicas
	scaler.Status.CurrentState = "Normal"

	if err := r.Status().Update(ctx, &scaler); err != nil {
		logger.Error(err, "Failed to update status")
		return ctrl.Result{}, err
	}

	// Standard Normal Requeue
	return ctrl.Result{RequeueAfter: 5 * time.Minute}, nil
}

// Helper to scale generic workloads via unstructured
func (r *CuratorScalerReconciler) scaleTargetWorkload(ctx context.Context, target *unstructured.Unstructured, replicas int32) error {
	err := unstructured.SetNestedField(target.Object, int64(replicas), "spec", "replicas")
	if err != nil {
		return err
	}
	return r.Update(ctx, target)
}

// Helper to query the internal ML Engine HTTP API
func (r *CuratorScalerReconciler) queryMLEngine(ctx context.Context, query, metricType string, currentReplicas int32) (int32, error) {
	reqBody := MLEngineRequest{
		PromQLQuery:     query,
		MetricType:      metricType,
		CurrentReplicas: currentReplicas,
	}

	jsonValue, err := json.Marshal(reqBody)
	if err != nil {
		return 0, fmt.Errorf("failed to marshal request: %w", err)
	}

	// Add timeout context for the HTTP call to fail cleanly
	httpCtx, cancel := context.WithTimeout(ctx, 10*time.Second)
	defer cancel()

	httpReq, err := http.NewRequestWithContext(httpCtx, "POST", "http://curator-ml-engine.curator-system.svc.cluster.local/predict", bytes.NewBuffer(jsonValue))
	if err != nil {
		return 0, fmt.Errorf("failed to construct request: %w", err)
	}
	httpReq.Header.Set("Content-Type", "application/json")

	client := &http.Client{}
	resp, err := client.Do(httpReq)
	if err != nil {
		return 0, fmt.Errorf("HTTP request failed: %w", err)
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		return 0, fmt.Errorf("ML engine responded with non-200 status code: %d", resp.StatusCode)
	}

	var mlResp MLEngineResponse
	if err := json.NewDecoder(resp.Body).Decode(&mlResp); err != nil {
		return 0, fmt.Errorf("failed to decode ML engine response: %w", err)
	}

	return mlResp.RecommendedReplicas, nil
}

func (r *CuratorScalerReconciler) SetupWithManager(mgr ctrl.Manager) error {
	return ctrl.NewControllerManagedBy(mgr).
		For(&curatorv1alpha1.CuratorScaler{}).
		Complete(r)
}
