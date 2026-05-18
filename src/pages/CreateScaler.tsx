import React, { useState } from "react";
import { PlusCircle, Sparkles, Check, Database, Zap, Cpu, ChevronDown, ChevronUp } from "lucide-react";
import { motion } from "motion/react";
import { cn } from "../lib/utils";
import { useAdvisor } from "../contexts/AdvisorContext";

interface CreateScalerProps {
  onCreated?: () => void;
}

export function CreateScaler({ onCreated }: CreateScalerProps) {
  const { addMessage } = useAdvisor();
  const [formData, setFormData] = useState({
    name: "",
    namespace: "default",
    targetKind: "Deployment",
    targetRef: "",
    minReplicas: 1,
    maxReplicas: 10,
    triggerType: "CPU",
    targetUtilization: 80,
    promServer: "",
    promMetricName: "",
    promQuery: "",
    autoDetect: true,
    manualThreshold: "",
    dryRunMode: false,
    fallbackPolicy: "KeepCurrent",
    syncInterval: 60,
    scaleUp: 0,
    scaleDown: 300,
    strategy: "P95_Statistical",
    trainingWindowDays: 30,
    retrainIntervalHours: 6,
    targetMAPE: 5.0,
    fallbackOnFailure: true,
    staticFallbackThreshold: "100",
    anomalyDetectionEnabled: true,
    anomalyAlgorithm: "Isolation_Forest",
    sensitivity: 1.15,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [isAdvancedOpen, setIsAdvancedOpen] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Construct the JSON payload for K8s API
    const payload = {
      apiVersion: "xcentralnn.io/v1alpha1",
      kind: "CuratorScaler",
      metadata: {
        name: formData.name,
        namespace: formData.namespace,
      },
      spec: {
        dryRun: formData.dryRunMode,
        fallbackPolicy: formData.fallbackPolicy,
        syncIntervalSeconds: formData.syncInterval,
        behavior: {
          scaleUp: {
            stabilizationWindowSeconds: formData.scaleUp
          },
          scaleDown: {
            stabilizationWindowSeconds: formData.scaleDown
          }
        },
        scaleTargetRef: {
          apiVersion: "apps/v1",
          kind: formData.targetKind,
          name: formData.targetRef,
        },
        minReplicas: formData.minReplicas,
        maxReplicas: formData.maxReplicas,
        trigger: {
          type: formData.triggerType.toLowerCase(),
          ...(["cpu", "memory"].includes(formData.triggerType.toLowerCase()) ? {
            targetUtilization: formData.targetUtilization
          } : {}),
          ...(formData.triggerType === "Prometheus" ? {
            metadata: {
              serverAddress: formData.promServer,
              metricName: formData.promMetricName
            },
            query: formData.promQuery,
            autoDetectThreshold: formData.autoDetect,
            ...(!formData.autoDetect ? { explicitThreshold: formData.manualThreshold } : {})
          } : {})
        },
        ...((formData.triggerType === "Prometheus" && formData.autoDetect) ? {
          mlConfig: {
            strategy: formData.strategy,
            trainingWindowDays: formData.trainingWindowDays,
            retrainIntervalHours: formData.retrainIntervalHours,
            accuracyBoundaries: {
              targetMAPE: formData.targetMAPE,
              fallbackOnFailure: formData.fallbackOnFailure,
              staticFallbackThreshold: formData.staticFallbackThreshold,
            },
            anomalyDetection: {
              enabled: formData.anomalyDetectionEnabled,
              algorithm: formData.anomalyAlgorithm,
              sensitivity: formData.sensitivity,
            }
          }
        } : {})
      }
    };

    console.log("Submitting CRD payload:", JSON.stringify(payload, null, 2));

    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setSuccess(true);
      addMessage(`Successfully provisioned Curator Scaler: ${formData.name}`, 'success');
      setTimeout(() => {
        setSuccess(false);
        if (onCreated) onCreated();
      }, 3000);
      setFormData({
        name: "",
        namespace: "default",
        targetKind: "Deployment",
        targetRef: "",
        minReplicas: 1,
        maxReplicas: 10,
        triggerType: "CPU",
        targetUtilization: 80,
        promServer: "",
        promMetricName: "",
        promQuery: "",
        autoDetect: true,
        manualThreshold: "",
        dryRunMode: false,
        fallbackPolicy: "KeepCurrent",
        syncInterval: 60,
        scaleUp: 0,
        scaleDown: 300,
        strategy: "P95_Statistical",
        trainingWindowDays: 30,
        retrainIntervalHours: 6,
        targetMAPE: 5.0,
        fallbackOnFailure: true,
        staticFallbackThreshold: "100",
        anomalyDetectionEnabled: true,
        anomalyAlgorithm: "Isolation_Forest",
        sensitivity: 1.15,
      });
    }, 1500);
  };

  return (
    <div className="p-4 md:p-8 technical-grid min-h-full max-w-4xl mx-auto">
      <div className="mb-8">
        <h2 className="text-2xl md:text-3xl font-bold dark:text-white text-gray-900 tracking-tighter mb-1">Create Curator Scaler</h2>
        <p className="dark:text-gray-500 text-gray-500 font-mono text-xs uppercase tracking-widest italic">Provision an intelligent autoscaling resource</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="dark:bg-curator-card bg-white border dark:border-curator-border border-gray-200 rounded-xl p-6">
          <h3 className="text-sm font-bold dark:text-white text-gray-900 mb-4 font-mono uppercase">Basic Configuration</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono dark:text-gray-400 text-gray-600 mb-1">Scaler Name</label>
              <input
                type="text"
                required
                className="w-full bg-transparent border dark:border-curator-border border-gray-300 rounded block px-3 py-2 text-sm dark:text-white text-gray-900 focus:outline-none focus:border-curator-accent transition-colors"
                value={formData.name}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g. backend-api-scaler"
              />
            </div>
            <div>
              <label className="block text-xs font-mono dark:text-gray-400 text-gray-600 mb-1">Namespace</label>
              <input
                type="text"
                required
                className="w-full bg-transparent border dark:border-curator-border border-gray-300 rounded block px-3 py-2 text-sm dark:text-white text-gray-900 focus:outline-none focus:border-curator-accent transition-colors"
                value={formData.namespace}
                onChange={e => setFormData({ ...formData, namespace: e.target.value })}
                placeholder="default"
              />
            </div>
            <div>
              <label className="block text-xs font-mono dark:text-gray-400 text-gray-600 mb-1">Target Kind</label>
              <select
                className="w-full bg-transparent border dark:border-curator-border border-gray-300 rounded block px-3 py-2 text-sm dark:text-white text-gray-900 focus:outline-none focus:border-curator-accent transition-colors appearance-none"
                value={formData.targetKind}
                onChange={e => setFormData({ ...formData, targetKind: e.target.value })}
              >
                <option value="Deployment" className="dark:bg-curator-dark bg-white">Deployment</option>
                <option value="StatefulSet" className="dark:bg-curator-dark bg-white">StatefulSet</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-mono dark:text-gray-400 text-gray-600 mb-1">Target Name</label>
              <input
                type="text"
                required
                className="w-full bg-transparent border dark:border-curator-border border-gray-300 rounded block px-3 py-2 text-sm dark:text-white text-gray-900 focus:outline-none focus:border-curator-accent transition-colors"
                value={formData.targetRef}
                onChange={e => setFormData({ ...formData, targetRef: e.target.value })}
                placeholder="e.g. backend-api-deployment"
              />
            </div>
            <div>
              <label className="block text-xs font-mono dark:text-gray-400 text-gray-600 mb-1">Min Replicas</label>
              <input
                type="number"
                min="1"
                required
                className="w-full bg-transparent border dark:border-curator-border border-gray-300 rounded block px-3 py-2 text-sm dark:text-white text-gray-900 focus:outline-none focus:border-curator-accent transition-colors"
                value={formData.minReplicas}
                onChange={e => setFormData({ ...formData, minReplicas: parseInt(e.target.value) })}
              />
            </div>
            <div>
              <label className="block text-xs font-mono dark:text-gray-400 text-gray-600 mb-1">Max Replicas</label>
              <input
                type="number"
                min={formData.minReplicas}
                required
                className="w-full bg-transparent border dark:border-curator-border border-gray-300 rounded block px-3 py-2 text-sm dark:text-white text-gray-900 focus:outline-none focus:border-curator-accent transition-colors"
                value={formData.maxReplicas}
                onChange={e => setFormData({ ...formData, maxReplicas: parseInt(e.target.value) })}
              />
            </div>
          </div>
        </div>

        <div className="dark:bg-curator-card bg-white border dark:border-curator-border border-gray-200 rounded-xl p-6">
          <h3 className="text-sm font-bold dark:text-white text-gray-900 mb-4 font-mono uppercase">Trigger Logic</h3>
          
          <div className="flex gap-4 mb-6">
            {["CPU", "Memory", "Prometheus"].map(t => (
              <button
                type="button"
                key={t}
                onClick={() => setFormData({ ...formData, triggerType: t })}
                className={cn(
                  "px-4 py-2 rounded border text-xs font-mono tracking-wide transition-all",
                  formData.triggerType === t
                    ? "dark:bg-curator-accent/20 bg-curator-accent/10 dark:text-curator-accent text-curator-accent border-curator-accent dark:border-curator-accent shadow-[0_0_10px_rgba(52,152,219,0.2)]"
                    : "dark:bg-transparent bg-gray-50 dark:border-curator-border border-gray-200 dark:text-gray-400 text-gray-500 hover:border-gray-400 dark:hover:border-white/20"
                )}
              >
                {t === "CPU" && <Cpu className="w-4 h-4 inline-block mr-2 -mt-0.5" />}
                {t === "Memory" && <Database className="w-4 h-4 inline-block mr-2 -mt-0.5" />}
                {t === "Prometheus" && <Zap className="w-4 h-4 inline-block mr-2 -mt-0.5" />}
                {t}
              </button>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: ["CPU", "Memory"].includes(formData.triggerType) ? 1 : 0, height: ["CPU", "Memory"].includes(formData.triggerType) ? "auto" : 0 }}
            className="overflow-hidden space-y-4"
          >
            {["CPU", "Memory"].includes(formData.triggerType) && (
              <div>
                <label className="block text-xs font-mono dark:text-gray-400 text-gray-600 mb-1">Target Utilization (%)</label>
                <input
                  type="number"
                  min="1"
                  max="100"
                  required={["CPU", "Memory"].includes(formData.triggerType)}
                  className="w-full bg-transparent border dark:border-curator-border border-gray-300 rounded block px-3 py-2 text-sm dark:text-white text-gray-900 focus:outline-none focus:border-curator-accent transition-colors"
                  value={formData.targetUtilization}
                  onChange={e => setFormData({ ...formData, targetUtilization: parseInt(e.target.value) || 0 })}
                />
              </div>
            )}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: formData.triggerType === "Prometheus" ? 1 : 0, height: formData.triggerType === "Prometheus" ? "auto" : 0 }}
            className="overflow-hidden space-y-4"
          >
            {formData.triggerType === "Prometheus" && (
              <>
                <div>
                  <label className="block text-xs font-mono dark:text-gray-400 text-gray-600 mb-1">Prometheus Server Address</label>
                  <input
                    type="text"
                    required={formData.triggerType === "Prometheus"}
                    className="w-full bg-transparent border dark:border-curator-border border-gray-300 rounded block px-3 py-2 text-sm dark:text-white text-gray-900 focus:outline-none focus:border-curator-accent transition-colors font-mono placeholder:opacity-50"
                    placeholder="http://prometheus-stack-alb-demo.svc.cluster.local:9090"
                    value={formData.promServer}
                    onChange={e => setFormData({ ...formData, promServer: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-xs font-mono dark:text-gray-400 text-gray-600 mb-1">Metric Name</label>
                  <input
                    type="text"
                    required={formData.triggerType === "Prometheus"}
                    className="w-full bg-transparent border dark:border-curator-border border-gray-300 rounded block px-3 py-2 text-sm dark:text-white text-gray-900 focus:outline-none focus:border-curator-accent transition-colors font-mono placeholder:opacity-50"
                    placeholder="kong-internal_bandwidth_mbps"
                    value={formData.promMetricName}
                    onChange={e => setFormData({ ...formData, promMetricName: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-xs font-mono dark:text-gray-400 text-gray-600 mb-1">PromQL Query</label>
                  <textarea
                    required={formData.triggerType === "Prometheus"}
                    rows={4}
                    className="w-full bg-transparent border dark:border-curator-border border-gray-300 rounded block px-3 py-2 text-sm dark:text-white text-gray-900 focus:outline-none focus:border-curator-accent transition-colors font-mono placeholder:opacity-50"
                    placeholder={"round(avg_over_time((sum(rate(...[2m])) * 8 / 1000000)[5m:10s]))"}
                    value={formData.promQuery}
                    onChange={e => setFormData({ ...formData, promQuery: e.target.value })}
                  />
                </div>
                <div className="flex items-center gap-3 p-4 rounded-lg bg-gradient-to-r dark:from-curator-accent/10 from-curator-accent/5 to-transparent border dark:border-curator-accent/20 border-curator-accent/30">
                  <input
                    type="checkbox"
                    id="autoDetect"
                    className="w-4 h-4 rounded border-gray-300 text-curator-accent focus:ring-curator-accent cursor-pointer"
                    checked={formData.autoDetect}
                    onChange={e => setFormData({ ...formData, autoDetect: e.target.checked })}
                  />
                  <label htmlFor="autoDetect" className="cursor-pointer text-sm font-bold dark:text-white text-gray-900 flex items-center gap-2">
                    Auto-Detect Threshold via ML 
                    <Sparkles className="w-3 h-3 text-curator-accent inline" />
                  </label>
                  <span className="text-xs dark:text-gray-400 text-gray-500 italic ml-auto font-serif">
                    Analyzes 30 days of data to compute limits
                  </span>
                </div>
                {!formData.autoDetect && (
                  <div>
                    <label className="block text-xs font-mono dark:text-gray-400 text-gray-600 mb-1">Manual Threshold</label>
                    <input
                      type="text"
                      required={formData.triggerType === "Prometheus" && !formData.autoDetect}
                      className="w-full bg-transparent border dark:border-curator-border border-gray-300 rounded block px-3 py-2 text-sm dark:text-white text-gray-900 focus:outline-none focus:border-curator-accent transition-colors font-mono placeholder:opacity-50"
                      placeholder="e.g. 500"
                      value={formData.manualThreshold}
                      onChange={e => setFormData({ ...formData, manualThreshold: e.target.value })}
                    />
                  </div>
                )}
              </>
            )}
          </motion.div>
        </div>

        {formData.triggerType === "Prometheus" && formData.autoDetect && (
          <div className="dark:bg-curator-card bg-white border dark:border-curator-border border-gray-200 rounded-xl p-6 overflow-hidden">
            <h3 className="text-sm font-bold dark:text-white text-gray-900 mb-4 font-mono uppercase text-curator-accent flex items-center gap-2">
              <Sparkles className="w-4 h-4" />
              ML Engine Intelligence & Forecasting
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-mono dark:text-gray-400 text-gray-600 mb-1">Training Strategy</label>
                <select
                  className="w-full bg-transparent border dark:border-curator-border border-gray-300 rounded block px-3 py-2 text-sm dark:text-white text-gray-900 focus:outline-none focus:border-curator-accent transition-colors appearance-none"
                  value={formData.strategy}
                  onChange={e => setFormData({ ...formData, strategy: e.target.value })}
                >
                  <option value="Prophet" className="dark:bg-curator-dark bg-white text-gray-900 dark:text-white">Prophet Time-Series</option>
                  <option value="P95_Statistical" className="dark:bg-curator-dark bg-white text-gray-900 dark:text-white">P95 Statistical</option>
                  <option value="ARIMA" className="dark:bg-curator-dark bg-white text-gray-900 dark:text-white">ARIMA</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-mono dark:text-gray-400 text-gray-600 mb-1">Fallback Policy</label>
                <select
                  className="w-full bg-transparent border dark:border-curator-border border-gray-300 rounded block px-3 py-2 text-sm dark:text-white text-gray-900 focus:outline-none focus:border-curator-accent transition-colors appearance-none"
                  value={formData.fallbackOnFailure ? "StaticThreshold" : "KeepCurrent"}
                  onChange={e => setFormData({ ...formData, fallbackOnFailure: e.target.value === "StaticThreshold" })}
                >
                  <option value="KeepCurrent" className="dark:bg-curator-dark bg-white text-gray-900 dark:text-white">KeepCurrent</option>
                  <option value="StaticThreshold" className="dark:bg-curator-dark bg-white text-gray-900 dark:text-white">StaticThreshold</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-mono dark:text-gray-400 text-gray-600 mb-1">Training Window (Days)</label>
                <input
                  type="number"
                  min="1"
                  className="w-full bg-transparent border dark:border-curator-border border-gray-300 rounded block px-3 py-2 text-sm dark:text-white text-gray-900 focus:outline-none focus:border-curator-accent transition-colors"
                  value={formData.trainingWindowDays}
                  onChange={e => setFormData({ ...formData, trainingWindowDays: parseInt(e.target.value) || 1 })}
                />
              </div>
              <div>
                <label className="block text-xs font-mono dark:text-gray-400 text-gray-600 mb-1">Retrain Interval (Hours)</label>
                <input
                  type="number"
                  min="1"
                  className="w-full bg-transparent border dark:border-curator-border border-gray-300 rounded block px-3 py-2 text-sm dark:text-white text-gray-900 focus:outline-none focus:border-curator-accent transition-colors"
                  value={formData.retrainIntervalHours}
                  onChange={e => setFormData({ ...formData, retrainIntervalHours: parseInt(e.target.value) || 1 })}
                />
              </div>
              <div className="md:col-span-2 mt-2">
                <div className="flex justify-between items-end mb-1">
                  <label className="block text-xs font-mono dark:text-gray-400 text-gray-600">Anomaly Sensitivity</label>
                  <span className="text-xs font-mono font-bold dark:text-curator-accent text-curator-accent">
                    {formData.sensitivity.toFixed(1)}x
                  </span>
                </div>
                <input
                  type="range"
                  min="1.0"
                  max="5.0"
                  step="0.1"
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700 accent-curator-accent"
                  value={formData.sensitivity}
                  onChange={e => setFormData({ ...formData, sensitivity: parseFloat(e.target.value) || 3.0 })}
                />
                <div className="flex justify-between mt-1 text-[10px] font-mono dark:text-gray-500 text-gray-400">
                  <span>1.0x (Strict)</span>
                  <span>5.0x (Loose)</span>
                </div>
              </div>
              
              {formData.fallbackOnFailure && (
                <div className="md:col-span-2 pt-2 border-t dark:border-curator-border border-gray-200">
                  <label className="block text-xs font-mono dark:text-gray-400 text-gray-600 mb-1">Static Fallback Threshold</label>
                  <input
                    type="text"
                    className="w-full bg-transparent border dark:border-curator-border border-gray-300 rounded block px-3 py-2 text-sm dark:text-white text-gray-900 focus:outline-none focus:border-curator-accent transition-colors font-mono placeholder:opacity-50"
                    placeholder="e.g. 1500"
                    value={formData.staticFallbackThreshold}
                    onChange={e => setFormData({ ...formData, staticFallbackThreshold: e.target.value })}
                  />
                </div>
              )}
            </div>
          </div>
        )}

        <div className="dark:bg-curator-card bg-white border dark:border-curator-border border-gray-200 rounded-xl overflow-hidden">
          <button 
            type="button" 
            onClick={() => setIsAdvancedOpen(!isAdvancedOpen)}
            className="w-full p-6 flex justify-between items-center bg-transparent focus:outline-none"
          >
            <h3 className="text-sm font-bold dark:text-white text-gray-900 font-mono uppercase">Advanced Behavior & Options</h3>
            {isAdvancedOpen ? <ChevronUp className="w-5 h-5 text-gray-500" /> : <ChevronDown className="w-5 h-5 text-gray-500" />}
          </button>
          
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: isAdvancedOpen ? 1 : 0, height: isAdvancedOpen ? "auto" : 0 }}
            className="overflow-hidden"
          >
            <div className="p-6 pt-0 space-y-6 border-t dark:border-curator-border border-gray-200 mt-2">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-mono dark:text-gray-400 text-gray-600 mb-1">Sync Interval (sec)</label>
                  <input
                    type="number"
                    min="10"
                    required={isAdvancedOpen}
                    className="w-full bg-transparent border dark:border-curator-border border-gray-300 rounded block px-3 py-2 text-sm dark:text-white text-gray-900 focus:outline-none focus:border-curator-accent transition-colors"
                    value={formData.syncInterval}
                    onChange={e => setFormData({ ...formData, syncInterval: parseInt(e.target.value) || 0 })}
                  />
                </div>
                <div>
                  <label className="block text-xs font-mono dark:text-gray-400 text-gray-600 mb-1">Scale Up Stabilization (sec)</label>
                  <input
                    type="number"
                    min="0"
                    required={isAdvancedOpen}
                    className="w-full bg-transparent border dark:border-curator-border border-gray-300 rounded block px-3 py-2 text-sm dark:text-white text-gray-900 focus:outline-none focus:border-curator-accent transition-colors"
                    value={formData.scaleUp}
                    onChange={e => setFormData({ ...formData, scaleUp: parseInt(e.target.value) || 0 })}
                  />
                </div>
                <div>
                  <label className="block text-xs font-mono dark:text-gray-400 text-gray-600 mb-1">Scale Down Stabilization (sec)</label>
                  <input
                    type="number"
                    min="0"
                    required={isAdvancedOpen}
                    className="w-full bg-transparent border dark:border-curator-border border-gray-300 rounded block px-3 py-2 text-sm dark:text-white text-gray-900 focus:outline-none focus:border-curator-accent transition-colors"
                    value={formData.scaleDown}
                    onChange={e => setFormData({ ...formData, scaleDown: parseInt(e.target.value) || 0 })}
                  />
                </div>
              </div>

              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="dryRunMode"
                  className="w-4 h-4 rounded border-gray-300 text-curator-accent focus:ring-curator-accent cursor-pointer"
                  checked={formData.dryRunMode}
                  onChange={e => setFormData({ ...formData, dryRunMode: e.target.checked })}
                />
                <label htmlFor="dryRunMode" className="cursor-pointer text-sm font-bold dark:text-white text-gray-900">
                  Dry-Run Mode (Recommendation Only)
                </label>
              </div>

              <div>
                <label className="block text-xs font-mono dark:text-gray-400 text-gray-600 mb-1">Fallback Policy</label>
                <select
                  className="w-full bg-transparent border dark:border-curator-border border-gray-300 rounded block px-3 py-2 text-sm dark:text-white text-gray-900 focus:outline-none focus:border-curator-accent transition-colors appearance-none"
                  value={formData.fallbackPolicy}
                  onChange={e => setFormData({ ...formData, fallbackPolicy: e.target.value })}
                >
                  <option value="KeepCurrent" className="dark:bg-curator-dark bg-white">KeepCurrent</option>
                  <option value="SafeScaleUp" className="dark:bg-curator-dark bg-white">SafeScaleUp</option>
                </select>
              </div>
            </div>
          </motion.div>
        </div>

        <button
          type="submit"
          disabled={isSubmitting || success}
          className="w-full flex items-center justify-center gap-2 py-4 rounded-xl font-bold transition-all duration-300 dark:bg-curator-accent/20 bg-curator-accent/10 text-curator-accent border dark:border-curator-accent/30 border-curator-accent border-dashed hover:border-solid hover:bg-curator-accent hover:text-white disabled:opacity-50 disabled:cursor-not-allowed group"
        >
          {isSubmitting ? (
            <span className="animate-pulse">Provisioning Model Context...</span>
          ) : success ? (
            <>
              <Check className="w-5 h-5" /> SCALER CRD APPLIED
            </>
          ) : (
            <>
              <PlusCircle className="w-5 h-5 group-hover:rotate-90 transition-transform" />
              INJECT CURATOR SCALER
            </>
          )}
        </button>
      </form>
    </div>
  );
}
