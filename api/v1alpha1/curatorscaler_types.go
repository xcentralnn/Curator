package v1alpha1

import (
	metav1 "k8s.io/apimachinery/pkg/apis/meta/v1"
)

// ScaleTargetRef defines the target resource to scale
type ScaleTargetRef struct {
	Group string `json:"group"`
	Kind  string `json:"kind"`
	Name  string `json:"name"`
}

// CuratorScalerSpec defines the desired state of CuratorScaler
type CuratorScalerSpec struct {
	ScaleTargetRef ScaleTargetRef `json:"scaleTargetRef"`
	MinReplicas    int32          `json:"minReplicas"`
	MaxReplicas    int32          `json:"maxReplicas"`
	PromQLQuery    string         `json:"promQLQuery"`
	MetricType     string         `json:"metricType"` // cpu, mem, traffic
	FallbackPolicy string         `json:"fallbackPolicy"`
}

// CuratorScalerStatus defines the observed state of CuratorScaler
type CuratorScalerStatus struct {
	CurrentReplicas int32              `json:"currentReplicas"`
	DesiredReplicas int32              `json:"desiredReplicas"`
	LastScaleTime   *metav1.Time       `json:"lastScaleTime,omitempty"`
	PanicMode       bool               `json:"panicMode"`
	CurrentState    string             `json:"currentState"` // Normal, Fallback, Panic
	Conditions      []metav1.Condition `json:"conditions,omitempty"`
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
	// SchemeBuilder.Register(&CuratorScaler{}, &CuratorScalerList{})
}
