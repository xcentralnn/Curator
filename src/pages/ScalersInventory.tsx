import { useState, useEffect } from "react";
import { generateMockScalers } from "../services/mockData";
import { Database, Plus, Search, ShieldCheck, ArrowUpRight, AlertTriangle, PauseCircle, AlertCircle, Play, Trash2 } from "lucide-react";
import { cn } from "../lib/utils";

export function ScalersInventory() {
  const [scalers, setScalers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate fetching delay
    const timer = setTimeout(() => {
      setScalers(generateMockScalers());
      setLoading(false);
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center h-full">
        <div className="text-center">
          <Database className="w-12 h-12 text-gray-700 dark:text-gray-500 mx-auto mb-4 animate-pulse" />
          <h2 className="text-xl font-bold dark:text-white text-gray-900 mb-2">Scalers Inventory</h2>
          <p className="dark:text-gray-500 text-gray-400 font-mono text-xs">Loading resources...</p>
        </div>
      </div>
    );
  }

  if (scalers.length === 0) {
    return (
      <div className="p-8 flex items-center justify-center h-full text-center">
        <div className="max-w-md w-full">
          <div className="w-20 h-20 bg-gray-100 dark:bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6">
            <Database className="w-10 h-10 text-gray-400" />
          </div>
          <h2 className="text-2xl font-bold dark:text-white text-gray-900 tracking-tight mb-3">No Scalers Found</h2>
          <p className="dark:text-gray-400 text-gray-500 text-sm mb-8">
            You haven't provisioned any CuratorScalers in this cluster yet. Create one to let ML take over your scaling logic.
          </p>
          <button className="flex items-center justify-center gap-2 w-full bg-curator-accent text-white px-5 py-3 rounded-lg font-bold text-sm hover:bg-curator-accent/90 transition-colors">
            <Plus className="w-4 h-4" />
            PROVISION NEW SCALER
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 technical-grid min-h-full">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 md:mb-10">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold dark:text-white text-gray-900 tracking-tighter mb-1">Scalers Inventory</h2>
          <p className="dark:text-gray-500 text-gray-400 font-mono text-[10px] md:text-xs uppercase tracking-widest italic">Curator v1 Managed Resources</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 dark:bg-curator-card bg-white border dark:border-curator-border border-gray-200 rounded-lg px-3 py-1.5 w-full md:w-64">
            <Search className="w-4 h-4 dark:text-gray-500 text-gray-400 shrink-0" />
            <input 
              type="text" 
              placeholder="Search scalers..." 
              className="bg-transparent border-none text-sm dark:text-white text-gray-900 focus:outline-none w-full placeholder:dark:text-gray-500 placeholder:text-gray-400"
            />
          </div>
          <button className="bg-curator-accent shrink-0 text-white p-2 rounded-lg hover:bg-curator-accent/90 transition-colors flex items-center justify-center">
            <Plus className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="dark:bg-curator-card bg-white border dark:border-curator-border border-gray-200 rounded-xl overflow-hidden overflow-x-auto shadow-sm">
        <table className="w-full text-left text-sm whitespace-nowrap">
          <thead className="dark:bg-white/5 bg-gray-50 border-b dark:border-curator-border border-gray-200">
            <tr>
              <th className="px-6 py-4 font-mono text-[10px] dark:text-gray-500 text-gray-500 uppercase font-bold tracking-wider">Name</th>
              <th className="px-6 py-4 font-mono text-[10px] dark:text-gray-500 text-gray-500 uppercase font-bold tracking-wider">Target Workload</th>
              <th className="px-6 py-4 font-mono text-[10px] dark:text-gray-500 text-gray-500 uppercase font-bold tracking-wider">Trigger</th>
              <th className="px-6 py-4 font-mono text-[10px] dark:text-gray-500 text-gray-500 uppercase font-bold tracking-wider text-center">Replicas (Min/Cur/Max)</th>
              <th className="px-6 py-4 font-mono text-[10px] dark:text-gray-500 text-gray-500 uppercase font-bold tracking-wider">Status</th>
              <th className="px-6 py-4 font-mono text-[10px] dark:text-gray-500 text-gray-500 uppercase font-bold tracking-wider text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y dark:divide-curator-border divide-gray-100">
            {scalers.map((scaler) => (
              <tr key={scaler.id} className="dark:hover:bg-white/[0.02] hover:bg-gray-50 transition-colors group">
                <td className="px-6 py-4">
                  <span className="font-bold dark:text-white text-gray-900">{scaler.name}</span>
                </td>
                <td className="px-6 py-4 dark:text-gray-400 text-gray-600 font-mono text-xs">
                  {scaler.targetWorkload}
                </td>
                <td className="px-6 py-4">
                  <span className="dark:bg-white/10 bg-gray-100 dark:text-gray-300 text-gray-700 px-2.5 py-1 rounded-md text-xs font-mono font-medium">
                    {scaler.triggerType}
                  </span>
                </td>
                <td className="px-6 py-4 text-center tabular-nums">
                  <span className="dark:text-gray-400 text-gray-500">{scaler.minReplicas}</span>
                  <span className="mx-1 dark:text-gray-600 text-gray-300">/</span>
                  <span className="font-bold dark:text-white text-gray-900">{scaler.currentReplicas}</span>
                  <span className="mx-1 dark:text-gray-600 text-gray-300">/</span>
                  <span className="dark:text-gray-400 text-gray-500">{scaler.maxReplicas}</span>
                </td>
                <td className="px-6 py-4">
                  <div className={cn(
                    "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold font-mono uppercase",
                    scaler.status === "Healthy" ? "bg-green-500/10 text-green-500" :
                    scaler.status === "Scaling" ? "bg-blue-500/10 text-blue-500" :
                    scaler.status === "Panic Mode" ? "bg-red-500/10 text-red-500" :
                    scaler.status === "Warning" ? "bg-yellow-500/10 text-yellow-500" :
                    "bg-gray-500/10 dark:text-gray-400 text-gray-600"
                  )}>
                    {scaler.status === "Healthy" && <ShieldCheck className="w-3 h-3" />}
                    {scaler.status === "Scaling" && <ArrowUpRight className="w-3 h-3 animate-bounce" />}
                    {scaler.status === "Warning" && <AlertTriangle className="w-3 h-3" />}
                    {scaler.status === "Paused" && <PauseCircle className="w-3 h-3" />}
                    {scaler.status === "Panic Mode" && <AlertCircle className="w-3 h-3" />}
                    {scaler.status}
                  </div>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button className={cn(
                      "p-1.5 rounded-lg transition-colors",
                      scaler.status === "Paused" 
                        ? "dark:hover:bg-green-500/20 hover:bg-green-100 dark:text-green-500 text-green-600" 
                        : "dark:hover:bg-yellow-500/20 hover:bg-yellow-100 dark:text-yellow-500 text-yellow-600"
                    )} title={scaler.status === "Paused" ? "Resume" : "Pause"}>
                      {scaler.status === "Paused" ? <Play className="w-4 h-4" /> : <PauseCircle className="w-4 h-4" />}
                    </button>
                    <button className="p-1.5 rounded-lg dark:hover:bg-red-500/20 hover:bg-red-100 dark:text-red-500 text-red-600 transition-colors" title="Delete">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
