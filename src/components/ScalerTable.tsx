import { MoreVertical, ExternalLink } from "lucide-react";
import { cn } from "../lib/utils";

interface Scaler {
  id: string;
  name: string;
  namespace: string;
  status: string;
  currentReplicas: number;
  minReplicas: number;
  maxReplicas: number;
  lastScaled: string;
  strategy: string;
}

interface ScalerTableProps {
  scalers: Scaler[];
  onSelect: (id: string) => void;
}

export function ScalerTable({ scalers, onSelect }: ScalerTableProps) {
  return (
    <div className="dark:bg-curator-card bg-white border dark:border-curator-border border-gray-200 rounded-xl overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-bottom dark:border-curator-border border-gray-200">
              <th className="px-6 py-4 text-[10px] font-mono font-bold dark:text-gray-500 text-gray-500 uppercase tracking-widest italic">Service / Metadata</th>
              <th className="px-6 py-4 text-[10px] font-mono font-bold dark:text-gray-500 text-gray-500 uppercase tracking-widest italic">Status</th>
              <th className="px-6 py-4 text-[10px] font-mono font-bold dark:text-gray-500 text-gray-500 uppercase tracking-widest italic text-center">Replicas (C/M/M)</th>
              <th className="px-6 py-4 text-[10px] font-mono font-bold dark:text-gray-500 text-gray-500 uppercase tracking-widest italic">Strategy</th>
              <th className="px-6 py-4 text-[10px] font-mono font-bold dark:text-gray-500 text-gray-500 uppercase tracking-widest italic">Last Update</th>
              <th className="px-6 py-4"></th>
            </tr>
          </thead>
          <tbody>
            {scalers.map((scaler) => (
              <tr 
                key={scaler.id} 
                onClick={() => onSelect(scaler.id)}
                className="group border-t dark:border-curator-border border-gray-100 dark:hover:bg-curator-accent/5 hover:bg-curator-accent/10 cursor-pointer transition-all duration-200"
              >
                <td className="px-6 py-4">
                  <div className="flex flex-col">
                    <span className="font-bold dark:text-white text-gray-900 group-hover:text-curator-accent transition-colors">{scaler.name}</span>
                    <span className="text-[10px] font-mono dark:text-gray-500 text-gray-400">{scaler.namespace} / CR-v1</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className={cn(
                    "inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold font-mono uppercase",
                    scaler.status === "Healthy" ? "bg-green-500/10 text-green-500" :
                    scaler.status === "Scaling" ? "bg-blue-500/10 text-blue-500" :
                    scaler.status === "Warning" ? "bg-yellow-500/10 text-yellow-500" :
                    scaler.status === "Paused" ? "bg-purple-500/10 text-purple-500" :
                    "bg-red-500/10 text-red-500"
                  )}>
                    <div className={cn(
                      "w-1.5 h-1.5 rounded-full",
                      scaler.status === "Healthy" ? "bg-green-500" :
                      scaler.status === "Scaling" ? "bg-blue-500 animate-pulse" :
                      scaler.status === "Warning" ? "bg-yellow-500" :
                      scaler.status === "Paused" ? "bg-purple-500" :
                      "bg-red-500"
                    )} />
                    {scaler.status}
                  </div>
                </td>
                <td className="px-6 py-4 text-center">
                  <div className="flex items-center justify-center gap-1 font-mono text-sm">
                    <span className="dark:text-white text-gray-900 font-bold">{scaler.currentReplicas}</span>
                    <span className="dark:text-gray-600 text-gray-300">/</span>
                    <span className="dark:text-gray-400 text-gray-500">{scaler.minReplicas}</span>
                    <span className="dark:text-gray-600 text-gray-300">/</span>
                    <span className="dark:text-gray-400 text-gray-500">{scaler.maxReplicas}</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className="px-2 py-1 dark:bg-white/5 bg-gray-50 border dark:border-white/10 border-gray-200 rounded text-[10px] font-mono dark:text-gray-400 text-gray-600 uppercase tracking-tight">
                    {scaler.strategy}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className="text-xs dark:text-gray-500 text-gray-400 font-mono">
                    {new Date(scaler.lastScaled).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <button className="dark:text-gray-600 text-gray-400 dark:hover:text-white hover:text-gray-900 transition-colors">
                    <MoreVertical className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
