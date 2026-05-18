package v1alpha1

import (
	autoscalingv2 "k8s.io/api/autoscaling/v2"
	metav1 "k8s.io/apimachinery/pkg/apis/meta/v1"
)

// Trigger defines the trigger to base the scaling on
type Trigger struct {
	Type                string            `json:"type"`
	Metadata            map[string]string `json:"metadata,omitempty"`
	Query               string            `json:"query,omitempty"`
	AutoDetectThreshold bool              `json:"autoDetectThreshold,omitempty"`
}

// ScalingRules defines the stabilization window for scaling up or down
type ScalingRules struct {
	StabilizationWindowSeconds int32 `json:"stabilizationWindowSeconds"`
}

// ScalingBehavior defines the behavior for scaling up and down
type ScalingBehavior struct {
	ScaleUp   ScalingRules `json:"scaleUp"`
	ScaleDown ScalingRules `json:"scaleDown"`
}

// AccuracyBoundaries defines boundaries for model accuracy
type AccuracyBoundaries struct {
	TargetMAPE              float32 `json:"targetMAPE"`
	FallbackOnFailure       bool    `json:"fallbackOnFailure"`
	StaticFallbackThreshold string  `json:"staticFallbackThreshold"`
}

// AnomalyDetection defines anomaly detection configs
type AnomalyDetection struct {
	Enabled     bool    `json:"enabled"`
	Algorithm   string  `json:"algorithm"`
	Sensitivity float32 `json:"sensitivity"`
}

// MLConfig defines the machine learning configuration for the scaler
type MLConfig struct {
	Strategy             string             `json:"strategy"`
	TrainingWindowDays   int32              `json:"trainingWindowDays"`
	RetrainIntervalHours int32              `json:"retrainIntervalHours"`
	AccuracyBoundaries   AccuracyBoundaries `json:"accuracyBoundaries"`
	AnomalyDetection     AnomalyDetection   `json:"anomalyDetection"`
}

// CuratorScalerSpec defines the desired state of CuratorScaler
type CuratorScalerSpec struct {
	// ScaleTargetRef points to the target resource to scale (e.g. Deployment)
	ScaleTargetRef autoscalingv2.CrossVersionObjectReference `json:"scaleTargetRef"`

	// MinReplicas is the lower limit for the number of replicas
	MinReplicas *int32 `json:"minReplicas,omitempty"`

	// MaxReplicas is the upper limit for the number of replicas
	MaxReplicas int32 `json:"maxReplicas"`

	// SyncIntervalSeconds is the frequency at which the controller evaluates metrics/ML
	SyncIntervalSeconds int32 `json:"syncIntervalSeconds,omitempty"`

	// Behavior controls scale-up and scale-down stabilization windows (cooldowns)
	Behavior *ScalingBehavior `json:"behavior,omitempty"`

	// Trigger defines the conditions for scaling up/down
	Trigger Trigger `json:"trigger"`

	// MLConfig defines the ML configuration
	MLConfig *MLConfig `json:"mlConfig,omitempty"`
}

// CuratorScalerStatus defines the observed state of CuratorScaler
type CuratorScalerStatus struct {
	CurrentReplicas     int32        `json:"currentReplicas"`
	DesiredReplicas     int32        `json:"desiredReplicas"`
	LastScaleTime       *metav1.Time `json:"lastScaleTime,omitempty"`
	CalculatedThreshold string       `json:"calculatedThreshold,omitempty"`
	LastPredictedTime   *metav1.Time `json:"lastPredictedTime,omitempty"`
}

// +kubebuilder:object:root=true
// +kubebuilder:subresource:status

// CuratorScaler is the Schema for the curatorscalers API
type CuratorScaler struct {
	metav1.TypeMeta   `json:",inline"`
	metav1.ObjectMeta `json:"metadata,omitempty"`

	Spec   CuratorScalerSpec   `json:"spec,omitempty"`
	Status CuratorScalerStatus `json:"status,omitempty"`
}

// +kubebuilder:object:root=true

// CuratorScalerList contains a list of CuratorScaler
type CuratorScalerList struct {
	metav1.TypeMeta `json:",inline"`
	metav1.ListMeta `json:"metadata,omitempty"`
	Items           []CuratorScaler `json:"items"`
}

func init() {
	SchemeBuilder.Register(&CuratorScaler{}, &CuratorScalerList{})
}
