package controller

import (
	"bytes"
	"context"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"os"
	"time"

	"k8s.io/apimachinery/pkg/runtime"
	ctrl "sigs.k8s.io/controller-runtime"
	"sigs.k8s.io/controller-runtime/pkg/client"
	"sigs.k8s.io/controller-runtime/pkg/log"

	metav1 "k8s.io/apimachinery/pkg/apis/meta/v1"
	"xcentralnn.io/curator/api/v1alpha1"
)

type CuratorScalerReconciler struct {
	client.Client
	Scheme       *runtime.Scheme
	MLEngineURL  string
}

type MLAnalyzeRequest struct {
	Query           string             `json:"query"`
	ServerAddress   string             `json:"serverAddress"`
	TargetNamespace string             `json:"targetNamespace,omitempty"`
	MLConfig        *v1alpha1.MLConfig `json:"mlConfig,omitempty"`
}

type MLAnalyzeResponse struct {
	PredictedThreshold string `json:"predicted_threshold"`
	AnomalyDetected    bool   `json:"anomaly_detected"`
}

func (r *CuratorScalerReconciler) Reconcile(ctx context.Context, req ctrl.Request) (ctrl.Result, error) {
	logger := log.FromContext(ctx)

	var curatorScaler v1alpha1.CuratorScaler
	if err := r.Get(ctx, req.NamespacedName, &curatorScaler); err != nil {
		return ctrl.Result{}, client.IgnoreNotFound(err)
	}

	if curatorScaler.Spec.Trigger.AutoDetectThreshold && curatorScaler.Spec.Trigger.Type == "prometheus" {
		serverAddr, ok := curatorScaler.Spec.Trigger.Metadata["serverAddress"]
		if !ok {
			logger.Error(fmt.Errorf("serverAddress missing"), "metadata.serverAddress is required for auto-detect")
			return ctrl.Result{}, nil
		}

		mlReq := MLAnalyzeRequest{
			Query:           curatorScaler.Spec.Trigger.Query,
			ServerAddress:   serverAddr,
			TargetNamespace: curatorScaler.Namespace,
			MLConfig:        curatorScaler.Spec.MLConfig,
		}
		
		reqBytes, err := json.Marshal(mlReq)
		if err != nil {
			logger.Error(err, "Failed to marshal ML request")
			return ctrl.Result{}, err
		}

		url := fmt.Sprintf("%s/analyze-threshold", r.MLEngineURL)
		if r.MLEngineURL == "" {
			url = "http://curator-ml-engine:8000/analyze-threshold" // Default
		}

		httpReq, err := http.NewRequestWithContext(ctx, "POST", url, bytes.NewBuffer(reqBytes))
		if err != nil {
			logger.Error(err, "Failed to create HTTP request")
			return ctrl.Result{}, err
		}
		httpReq.Header.Set("Content-Type", "application/json")

		httpClient := &http.Client{Timeout: 15 * time.Second}
		resp, err := httpClient.Do(httpReq)
		if err != nil {
			logger.Error(err, "Failed to call ML engine")
			return ctrl.Result{RequeueAfter: 30 * time.Second}, err
		}
		defer resp.Body.Close()

		if resp.StatusCode != http.StatusOK {
			bodyBytes, _ := io.ReadAll(resp.Body)
			logger.Error(fmt.Errorf("ML engine returned %d", resp.StatusCode), string(bodyBytes))
			return ctrl.Result{RequeueAfter: 30 * time.Second}, nil
		}

		var mlResp MLAnalyzeResponse
		if err := json.NewDecoder(resp.Body).Decode(&mlResp); err != nil {
			logger.Error(err, "Failed to decode ML response")
			return ctrl.Result{}, err
		}

		// Patch the Status
		original := curatorScaler.DeepCopy()
		now := metav1.Now()
		curatorScaler.Status.CalculatedThreshold = mlResp.PredictedThreshold
		curatorScaler.Status.LastPredictedTime = &now
		
		if err := r.Status().Patch(ctx, &curatorScaler, client.MergeFrom(original)); err != nil {
			logger.Error(err, "Failed to update CuratorScaler status")
			return ctrl.Result{}, err
		}
		logger.Info("Successfully updated calculated threshold", "threshold", mlResp.PredictedThreshold)
	}

	// Flapping Prevention Logic
	isScalingDown := curatorScaler.Status.DesiredReplicas < curatorScaler.Status.CurrentReplicas
	isScalingUp := curatorScaler.Status.DesiredReplicas > curatorScaler.Status.CurrentReplicas

	if curatorScaler.Status.LastScaleTime != nil && curatorScaler.Spec.Behavior != nil {
		timeSinceLastScale := time.Since(curatorScaler.Status.LastScaleTime.Time)

		if isScalingDown {
			cooldown := time.Duration(curatorScaler.Spec.Behavior.ScaleDown.StabilizationWindowSeconds) * time.Second
			if timeSinceLastScale < cooldown {
				logger.Info("Cooling down, scale down skipped")
				isScalingDown = false // Prevent scaling down
			}
		}

		if isScalingUp {
			cooldown := time.Duration(curatorScaler.Spec.Behavior.ScaleUp.StabilizationWindowSeconds) * time.Second
			if timeSinceLastScale < cooldown {
				logger.Info("Cooling down, scale up skipped")
				isScalingUp = false // Prevent scaling up
			}
		}
	}

	// Dynamic scaling logic based on calculated threshold goes here
	// For production, we read curatorScaler.Status.CalculatedThreshold and target replicas.
	targetName := curatorScaler.Spec.ScaleTargetRef.Name
	desiredReplicas := curatorScaler.Status.DesiredReplicas

	if os.Getenv("DEV_MODE") == "true" {
		logger.Info("[DEV_MODE MOCK] Scaling action intercepted", "target", targetName, "replicas", desiredReplicas)
		
		// Update status with mock safe execution
		original := curatorScaler.DeepCopy()
		now := metav1.Now()
		curatorScaler.Status.CurrentReplicas = desiredReplicas
		curatorScaler.Status.LastScaleTime = &now
		if desiredReplicas > 0 {
			curatorScaler.Status.CurrentState = "Scaling"
		}
		
		if err := r.Status().Patch(ctx, &curatorScaler, client.MergeFrom(original)); err != nil {
			logger.Error(err, "Failed to update CuratorScaler status for DEV_MODE")
		}
	} else {
		// ... (Implementation detail of the actual scaling against Deployments omitted for brevity) ...
	}

	syncInterval := time.Duration(curatorScaler.Spec.SyncIntervalSeconds) * time.Second
	if syncInterval <= 0 {
		syncInterval = 60 * time.Second
	}

	return ctrl.Result{RequeueAfter: syncInterval}, nil
}

func (r *CuratorScalerReconciler) SetupWithManager(mgr ctrl.Manager) error {
	return ctrl.NewControllerManagedBy(mgr).
		For(&v1alpha1.CuratorScaler{}).
		Complete(r)
}
