import { useEffect, useState } from "react";
import { MetricCard } from "../components/MetricCard";
import { ScalerTable } from "../components/ScalerTable";
import { cn } from "../lib/utils";
import { Zap, Server, ShieldCheck, Activity, Brain } from "lucide-react";
import { MascotPlatypus } from "../components/VisualBrand";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

export function Dashboard() {
  const [scalers, setScalers] = useState<any[]>([]);
  const [metrics, setMetrics] = useState<any[]>([]);
  const [promMetrics, setPromMetrics] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [sRes, mRes, pRes] = await Promise.all([
          fetch("/api/scalers"),
          fetch("/api/metrics"),
          fetch("/api/prometheus/metrics")
        ]);
        setScalers(await sRes.json());
        setMetrics(await mRes.json());
        setPromMetrics(await pRes.json());
      } catch (e) {
        console.error("Dashboard fetch error", e);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 5000);
    return () => clearInterval(interval);
  }, []);

  // Mock series for cards
  const generateSeries = () => [...Array(10)].map((_, i) => ({ value: Math.floor(Math.random() * 50) + 20 }));

  if (loading) return (
    <div className="flex-1 flex items-center justify-center">
      <div className="text-curator-accent font-mono animate-pulse">Initializing Controller Context...</div>
    </div>
  );

  return (
    <div className="flex-1 p-4 md:p-8 technical-grid min-h-full">
      <header className="flex flex-col md:flex-row md:justify-between md:items-end gap-4 mb-6 md:mb-10">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold dark:text-white text-gray-900 tracking-tighter mb-2">Global Overview</h2>
          <div className="flex max-w-full flex-wrap items-center gap-3 font-mono text-[10px] md:text-xs uppercase tracking-widest">
            <div className="flex items-center gap-2">
              <span className="dark:text-gray-500 text-gray-400">Cluster:</span>
              <select className="bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-md px-2 py-1 dark:text-white text-gray-900 focus:outline-none focus:ring-1 focus:ring-curator-accent outline-none">
                <option>production-asia-1</option>
                <option>production-us-east</option>
                <option>staging-eu-1</option>
              </select>
            </div>
            <div className="flex items-center gap-2 hidden sm:flex">
              <span className="dark:text-gray-500 text-gray-400">/</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="dark:text-gray-500 text-gray-400">Namespace:</span>
              <select className="bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-md px-2 py-1 dark:text-white text-gray-900 focus:outline-none focus:ring-1 focus:ring-curator-accent outline-none">
                <option>all</option>
                <option>auth-service</option>
                <option>payment-gateway</option>
              </select>
            </div>
          </div>
        </div>
        <div className="flex gap-4">
          <div className="text-left md:text-right">
            <p className="text-[10px] font-mono font-bold dark:text-gray-600 text-gray-500 uppercase mb-1">Total Resources</p>
            <p className="text-lg md:text-xl font-bold dark:text-white text-gray-900 tracking-tight">1.2k Replicas</p>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 md:gap-6 mb-8 md:mb-10">
        <MetricCard 
          label="Total Scalers" 
          value={scalers.length} 
          data={generateSeries()} 
          trend="neutral" 
          color="#3498db"
        />
        <MetricCard 
          label="Avg CPU Load" 
          value={35} 
          unit="%"
          data={generateSeries()} 
          trend="up" 
          color="#3B82F6"
          capacityMax={100}
        />
        <MetricCard 
          label="Memory Usage" 
          value={65} 
          unit="Gi"
          data={generateSeries()} 
          trend="down" 
          color="#A855F7"
          capacityMax={128}
        />
        <MetricCard 
          label="Uptime" 
          value="99.9" 
          unit="%"
          data={generateSeries()} 
          trend="neutral" 
          color="#3498db"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8 mb-8">
        <div className="lg:col-span-3 dark:bg-curator-card bg-white border dark:border-curator-border border-gray-200 rounded-xl p-4 md:p-6 flex flex-col min-w-0">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-mono text-xs md:text-sm font-bold dark:text-gray-400 text-gray-500 uppercase tracking-widest flex items-center gap-2">
              <Activity className="w-5 h-5 text-curator-accent shrink-0" /> Live Cluster Performance
            </h3>
            <span className="text-[10px] font-mono dark:text-gray-600 text-gray-500 italic">via Prometheus API</span>
          </div>
          
          <div className="h-64 md:h-80 w-full relative" style={{ minWidth: 0 }}>
            <div className="absolute -top-1 left-2 text-[10px] font-mono text-gray-500 z-10">(Cores)</div>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={promMetrics} margin={{ top: 20, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorCpu" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3498db" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#3498db" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorMemory" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#A855F7" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#A855F7" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorBandwidth" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="time" stroke="#6b7280" fontSize={10} tickMargin={10} minTickGap={30} />
                <YAxis stroke="#6b7280" fontSize={10} />
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.2} vertical={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1f2937', borderColor: '#374151', borderRadius: '8px', fontSize: '12px' }}
                  itemStyle={{ fontSize: '12px', fontWeight: 'bold' }}
                  labelStyle={{ color: '#9ca3af', marginBottom: '4px' }}
                />
                <Legend verticalAlign="top" align="right" iconType="circle" wrapperStyle={{ fontSize: '12px', paddingBottom: '10px', marginTop: '-15px' }} />
                <Area type="monotone" dataKey="cpu" name="Actual Load (CPU)" stroke="#10b981" strokeWidth={2} fillOpacity={1} fill="url(#colorBandwidth)" />
                <Area type="monotone" dataKey="memory" name="AI Predicted Threshold" stroke="#A855F7" strokeWidth={2} fillOpacity={1} fill="url(#colorMemory)" />
                <Area type="monotone" dataKey="bandwidth" name="Bandwidth (Mbps)" stroke="#3498db" strokeWidth={2} fillOpacity={1} fill="url(#colorCpu)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
        <div className="lg:col-span-2 flex flex-col min-w-0">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 mb-4">
            <h3 className="font-mono text-xs font-bold dark:text-gray-400 text-gray-500 uppercase tracking-widest flex items-center gap-2">
              <Server className="w-4 h-4 text-curator-accent shrink-0" /> Active Curator Scalers
            </h3>
            <span className="text-[10px] font-mono dark:text-gray-600 text-gray-500 italic">Connected to ML-Engine</span>
          </div>
          <div className="overflow-hidden border dark:border-curator-border border-gray-200 dark:bg-curator-card bg-white rounded-xl">
            <ScalerTable scalers={scalers} onSelect={() => {}} />
          </div>

          {/* AI Status Card */}
          <div className="mt-8 p-4 md:p-6 rounded-2xl bg-gradient-to-r dark:from-curator-accent/5 from-curator-accent/10 to-transparent border dark:border-white/5 border-gray-200 flex flex-col sm:flex-row items-center gap-4 md:gap-6 overflow-hidden relative">
            <div className="absolute top-0 right-0 sm:right-10 bottom-0 flex items-center dark:opacity-5 opacity-10 pointer-events-none">
              <Brain className="w-32 h-32 sm:w-40 sm:h-40 text-curator-accent" />
            </div>
            
            <div className="flex flex-col sm:flex-row items-center gap-4 md:gap-6 relative z-10 text-center sm:text-left">
              <MascotPlatypus className="w-12 h-12 md:w-16 md:h-16 shrink-0" />
              <div>
                <h4 className="text-sm md:text-md font-bold dark:text-white text-gray-900 mb-2 flex items-center justify-center sm:justify-start gap-2">
                  <Zap className="w-4 h-4 text-yellow-500 fill-yellow-500 shrink-0" />
                  Curator Scaler Intelligence Online
                </h4>
                <p className="text-xs md:text-sm dark:text-gray-400 text-gray-600 max-w-md leading-relaxed">
                  ML Engine is processing time-series data. No anomalies detected. 
                  State: <span className="text-curator-accent font-mono font-bold block sm:inline mt-1 sm:mt-0">Predictive Mode</span>.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col min-w-0">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-mono text-xs font-bold dark:text-gray-400 text-gray-500 uppercase tracking-widest flex items-center gap-2">
              <Zap className="w-4 h-4 text-yellow-500 shrink-0" /> Logic Triggers
            </h3>
          </div>
          <div className="dark:bg-curator-card bg-white border dark:border-curator-border border-gray-200 rounded-xl p-4 flex flex-col gap-4">
            {[
              { time: "2m ago", event: "Predictive scaling triggered for payment-service", status: "Executed" },
              { time: "5m ago", event: "Horizontal scaling detected spike in auth-service", status: "Executed" },
              { time: "12m ago", event: "Anomaly detected in orders-db (Read spike)", status: "Alert" },
            ].map((log, i) => (
              <div key={i} className="flex gap-3 md:gap-4 p-3 rounded-lg dark:bg-white/5 bg-gray-50 border dark:border-white/5 border-gray-100 dark:hover:border-white/10 hover:border-gray-300 transition-colors items-start">
                <div className="text-[10px] font-mono dark:text-gray-600 text-gray-500 whitespace-nowrap pt-0.5">{log.time}</div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs dark:text-gray-300 text-gray-700 mb-2 leading-relaxed truncate whitespace-break-spaces">{log.event}</p>
                  <span className={cn(
                    "text-[9px] font-bold font-mono px-1.5 py-0.5 rounded uppercase inline-block",
                    log.status === "Executed" ? "text-curator-accent dark:bg-curator-accent/10 bg-curator-accent/20" : "text-yellow-600 dark:text-yellow-500 dark:bg-yellow-500/10 bg-yellow-500/20"
                  )}>
                    {log.status}
                  </span>
                </div>
              </div>
            ))}
            <button className="w-full py-2 text-[10px] font-mono dark:text-gray-500 text-gray-400 dark:hover:text-white hover:text-gray-900 transition-colors border-t dark:border-curator-border border-gray-100 mt-2 pt-4">
              VIEW SYSTEM AUDIT LOGS →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
