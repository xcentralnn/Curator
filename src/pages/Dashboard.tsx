import { useEffect, useState } from "react";
import { MetricCard } from "../components/MetricCard";
import { ScalerTable } from "../components/ScalerTable";
import { cn } from "../lib/utils";
import { Zap, Server, ShieldCheck, Activity, Brain } from "lucide-react";
import { MascotPlatypus } from "../components/VisualBrand";

export function Dashboard() {
  const [scalers, setScalers] = useState<any[]>([]);
  const [metrics, setMetrics] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [sRes, mRes] = await Promise.all([
          fetch("/api/scalers"),
          fetch("/api/metrics")
        ]);
        setScalers(await sRes.json());
        setMetrics(await mRes.json());
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
          <h2 className="text-2xl md:text-3xl font-bold dark:text-white text-gray-900 tracking-tighter mb-1">Global Overview</h2>
          <p className="dark:text-gray-500 text-gray-400 font-mono text-[10px] md:text-xs uppercase tracking-widest italic">Cluster: production-asia-1 / Namespace: all</p>
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
          value={Math.floor(metrics.reduce((acc, m) => acc + m.cpu, 0) / (metrics.length || 1))} 
          unit="%"
          data={generateSeries()} 
          trend="up" 
          color="#3B82F6"
        />
        <MetricCard 
          label="Memory Usage" 
          value={Math.floor(metrics.reduce((acc, m) => acc + m.memory, 0) / (metrics.length || 1))} 
          unit="Gi"
          data={generateSeries()} 
          trend="down" 
          color="#A855F7"
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
        <div className="lg:col-span-2 flex flex-col min-w-0">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 mb-4">
            <h3 className="font-mono text-xs font-bold dark:text-gray-400 text-gray-500 uppercase tracking-widest flex items-center gap-2">
              <Server className="w-4 h-4 text-curator-accent shrink-0" /> Active CuratorScalers
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
                  Curator Intelligence Online
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
