import { useState, useEffect, useMemo } from "react";
import { generateMLTimeSeriesData } from "../services/mockData";
import { Activity, Brain, AlertCircle, Zap, ShieldCheck, Clock, CheckCircle } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceDot, Legend } from 'recharts';
import { cn } from "../lib/utils";

export function MLAnalytics() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTarget, setSelectedTarget] = useState("kong-internal-gateway");

  const targetConfigs = {
    "kong-internal-gateway": {
      strategy: "Prophet Time-Series",
      trainingWindowDays: 30,
      accuracy: 4.2,
      confidence: 95.8,
      retrainHours: 6
    },
    "payment-service": {
      strategy: "P95 Statistical",
      trainingWindowDays: 14,
      accuracy: 6.8,
      confidence: 91.2,
      retrainHours: 12
    },
    "auth-service": {
      strategy: "Isolation Forest + P99",
      trainingWindowDays: 7,
      accuracy: 2.1,
      confidence: 98.5,
      retrainHours: 1
    }
  };

  const currentConfig = targetConfigs[selectedTarget as keyof typeof targetConfigs];

  useEffect(() => {
    // Simulate ML Engine connect delay
    const timer = setTimeout(() => {
      setData(generateMLTimeSeriesData(60));
      setLoading(false);
    }, 1000);
    
    // Auto-refresh every 5 seconds to simulate live data
    const interval = setInterval(() => {
      setData(generateMLTimeSeriesData(60));
    }, 5000);
    
    return () => {
      clearTimeout(timer);
      clearInterval(interval);
    };
  }, [selectedTarget]);

  const anomalies = useMemo(() => data.filter(d => d.isAnomaly), [data]);
  const anomalyCount = anomalies.length;

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center h-full">
        <div className="text-center">
          <Activity className="w-12 h-12 text-curator-accent mx-auto mb-4 animate-pulse" />
          <h2 className="text-xl font-bold dark:text-white text-gray-900 mb-2">ML Engine Analytics</h2>
          <p className="dark:text-gray-500 text-gray-400 font-mono text-xs">Connecting to Prometheus Context & ML Models...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 technical-grid min-h-full">
      {/* Target Selector Action Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 md:mb-8">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold dark:text-white text-gray-900 tracking-tighter mb-2 flex items-center gap-3">
            <Brain className="w-8 h-8 text-curator-accent" />
            ML Engine Analytics
          </h2>
          <div className="flex items-center gap-2 font-mono text-[10px] md:text-xs uppercase tracking-widest">
            <span className="dark:text-gray-500 text-gray-400">Target Analyzer:</span>
            <select 
              value={selectedTarget}
              onChange={(e) => {
                setSelectedTarget(e.target.value);
                setLoading(true);
                setTimeout(() => {
                  setData(generateMLTimeSeriesData(60));
                  setLoading(false);
                }, 600);
              }}
              className="bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-md px-2 py-1 dark:text-white text-gray-900 focus:outline-none focus:ring-1 focus:ring-curator-accent outline-none font-bold"
            >
              <option value="kong-internal-gateway">kong-internal-gateway</option>
              <option value="payment-service">payment-service</option>
              <option value="auth-service">auth-service</option>
            </select>
          </div>
        </div>
        <div className="flex gap-4">
          <div className="dark:bg-curator-card bg-white border dark:border-curator-border border-gray-200 rounded-lg px-4 py-2 flex flex-col min-w-[120px]">
            <span className="text-[10px] uppercase font-mono dark:text-gray-500 text-gray-400 font-bold">Status</span>
            <span className="text-green-500 font-bold text-sm flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              CONNECTED
            </span>
          </div>
          <div className="dark:bg-curator-card bg-white border dark:border-curator-border border-gray-200 rounded-lg px-4 py-2 flex flex-col min-w-[120px]">
            <span className="text-[10px] uppercase font-mono dark:text-gray-500 text-gray-400 font-bold">Anomalies Detected</span>
            <span className={cn("font-bold text-sm flex items-center gap-1", anomalyCount > 0 ? "text-curator-panic" : "text-gray-900 dark:text-white")}>
              {anomalyCount > 0 && <AlertCircle className="w-3 h-3" />}
              {anomalyCount}
            </span>
          </div>
        </div>
      </div>

      {/* ML Model Metadata Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="dark:bg-curator-card bg-white border dark:border-curator-border border-gray-200 p-4 rounded-xl">
          <div className="flex items-center gap-2 mb-2">
            <Zap className="w-4 h-4 text-purple-500" />
            <span className="text-xs font-mono dark:text-gray-500 text-gray-400 uppercase font-bold tracking-wider">Active Strategy</span>
          </div>
          <div className="text-lg font-bold dark:text-white text-gray-900 tracking-tight">{currentConfig.strategy}</div>
        </div>
        <div className="dark:bg-curator-card bg-white border dark:border-curator-border border-gray-200 p-4 rounded-xl">
          <div className="flex items-center gap-2 mb-2">
            <Activity className="w-4 h-4 text-blue-500" />
            <span className="text-xs font-mono dark:text-gray-500 text-gray-400 uppercase font-bold tracking-wider">Training Window</span>
          </div>
          <div className="text-lg font-bold dark:text-white text-gray-900 tracking-tight">{currentConfig.trainingWindowDays} Days Historical</div>
          <div className="text-[10px] font-mono dark:text-gray-500 text-gray-400 mt-1">via Prometheus API</div>
        </div>
        <div className="dark:bg-curator-card bg-white border dark:border-curator-border border-gray-200 p-4 rounded-xl">
          <div className="flex items-center gap-2 mb-2">
            <ShieldCheck className="w-4 h-4 text-green-500" />
            <span className="text-xs font-mono dark:text-gray-500 text-gray-400 uppercase font-bold tracking-wider">Model Accuracy</span>
          </div>
          <div className="text-lg font-bold dark:text-white text-gray-900 tracking-tight">MAPE: {currentConfig.accuracy}%</div>
          <div className="text-[10px] font-mono dark:text-green-500/70 text-green-600 mt-1">Confidence: {currentConfig.confidence}%</div>
        </div>
        <div className="dark:bg-curator-card bg-white border dark:border-curator-border border-gray-200 p-4 rounded-xl">
          <div className="flex items-center gap-2 mb-2">
            <Clock className="w-4 h-4 text-orange-500" />
            <span className="text-xs font-mono dark:text-gray-500 text-gray-400 uppercase font-bold tracking-wider">Retrain Interval</span>
          </div>
          <div className="text-lg font-bold dark:text-white text-gray-900 tracking-tight">Every {currentConfig.retrainHours} hours</div>
        </div>
      </div>

      {/* Chart Section */}
      <div className="dark:bg-curator-card bg-white border dark:border-curator-border border-gray-200 rounded-xl p-4 md:p-6 mb-8 flex flex-col min-w-0">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h3 className="font-bold dark:text-white text-gray-900 flex items-center gap-2">
               Traffic Prediction vs Actual
            </h3>
            <p className="text-xs dark:text-gray-500 text-gray-400 mt-1">Comparing auto-detected threshold bounds against real traffic.</p>
          </div>
        </div>
        
        <div className="h-80 md:h-[450px] w-full" style={{ minWidth: 0 }}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 10, right: 30, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorTraffic" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <XAxis dataKey="timestamp" stroke="#6b7280" fontSize={10} tickMargin={10} minTickGap={30} />
              <YAxis stroke="#6b7280" fontSize={10} />
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.2} vertical={false} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#1f2937', borderColor: '#374151', borderRadius: '8px', fontSize: '12px', color: '#fff' }}
                itemStyle={{ fontSize: '12px', fontWeight: 'bold' }}
                labelStyle={{ color: '#9ca3af', marginBottom: '4px' }}
              />
              <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '20px' }} />
              
              <Area 
                type="monotone" 
                dataKey="actualTraffic" 
                name={`${selectedTarget}_bandwidth_mbps (Actual)`} 
                stroke="#8b5cf6" 
                strokeWidth={3} 
                fillOpacity={1} 
                fill="url(#colorTraffic)" 
              />
              
              <Area 
                type="monotone" 
                dataKey="predictedThreshold" 
                name="ML Predicted Threshold" 
                stroke="#64748b" 
                strokeWidth={2} 
                strokeDasharray="5 5" 
                fillOpacity={0} 
              />
              
              {data.map((entry, index) => {
                if (entry.isAnomaly) {
                  return (
                    <ReferenceDot 
                      key={`anomaly-${index}`} 
                      x={entry.timestamp} 
                      y={entry.actualTraffic} 
                      r={5} 
                      fill="#ef4444" 
                      stroke="#7f1d1d"
                      strokeWidth={2}
                    />
                  );
                }
                return null;
              })}
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Anomaly Breakdown Table */}
      {anomalies.length > 0 && (
        <div className="dark:bg-curator-card bg-white border dark:border-curator-border border-gray-200 rounded-xl overflow-hidden shadow-sm">
          <div className="p-4 md:p-6 border-b dark:border-curator-border border-gray-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <h3 className="font-bold dark:text-white text-gray-900 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-curator-panic" />
              Anomaly Breakdown
            </h3>
            <span className="text-xs font-mono dark:text-gray-500 text-gray-400">{anomalies.length} events logged in current window</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="dark:bg-white/5 bg-gray-50 border-b dark:border-curator-border border-gray-200">
                <tr>
                  <th className="px-6 py-4 font-mono text-[10px] dark:text-gray-500 text-gray-500 uppercase font-bold tracking-wider">Timestamp</th>
                  <th className="px-6 py-4 font-mono text-[10px] dark:text-gray-500 text-gray-500 uppercase font-bold tracking-wider text-right">Actual Value</th>
                  <th className="px-6 py-4 font-mono text-[10px] dark:text-gray-500 text-gray-500 uppercase font-bold tracking-wider text-right">Predicted Threshold</th>
                  <th className="px-6 py-4 font-mono text-[10px] dark:text-gray-500 text-gray-500 uppercase font-bold tracking-wider text-right">Deviation</th>
                  <th className="px-6 py-4 font-mono text-[10px] dark:text-gray-500 text-gray-500 uppercase font-bold tracking-wider">System Action</th>
                </tr>
              </thead>
              <tbody className="divide-y dark:divide-curator-border divide-gray-100">
                {anomalies.slice().reverse().map((anomaly, idx) => {
                  const deviation = (((anomaly.actualTraffic - anomaly.predictedThreshold) / anomaly.predictedThreshold) * 100).toFixed(1);
                  const isSevere = Number(deviation) > 25;
                  return (
                    <tr key={idx} className="dark:hover:bg-white/[0.02] hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 font-mono text-xs dark:text-gray-400 text-gray-600">{anomaly.timestamp}</td>
                      <td className="px-6 py-4 text-right font-bold dark:text-white text-gray-900 tabular-nums">{anomaly.actualTraffic}</td>
                      <td className="px-6 py-4 text-right font-mono text-xs dark:text-gray-500 text-gray-500 tabular-nums">{anomaly.predictedThreshold}</td>
                      <td className="px-6 py-4 text-right">
                        <span className={cn(
                          "px-2 py-1 rounded-md text-xs font-mono font-bold inline-flex items-center gap-1",
                          isSevere ? "bg-red-500/10 text-red-500" : "bg-yellow-500/10 text-yellow-500"
                        )}>
                          +{deviation}%
                        </span>
                      </td>
                      <td className="px-6 py-4 text-xs font-mono">
                        {isSevere ? (
                          <span className="flex items-center gap-1.5 text-red-500">
                            <Zap className="w-3 h-3" /> Triggered Panic Mode
                          </span>
                        ) : (
                          <span className="flex items-center gap-1.5 dark:text-gray-400 text-gray-500">
                            <CheckCircle className="w-3 h-3" /> Ignored - Cooldown
                          </span>
                        )}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

