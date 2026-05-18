import { motion } from "motion/react";
import { AreaChart, Area, ResponsiveContainer, YAxis } from "recharts";
import { cn } from "../lib/utils";

interface MetricCardProps {
  label: string;
  value: string | number;
  unit?: string;
  data: any[];
  trend: "up" | "down" | "neutral";
  color?: string;
  capacityMax?: number;
}

export function MetricCard({ label, value, unit, data, trend, color = "#00FF9C", capacityMax }: MetricCardProps) {
  return (
    <div className="dark:bg-curator-card bg-white border dark:border-curator-border border-gray-200 p-5 rounded-xl overflow-hidden relative group">
      <div className="absolute inset-0 bg-gradient-to-br dark:from-white/[0.02] from-black/[0.02] to-transparent pointer-events-none" />
      
      <div className="relative z-10 flex border-b-transparent justify-between items-start mb-2">
        <div>
          <p className="text-[10px] font-mono dark:text-gray-500 text-gray-500 uppercase tracking-widest mb-1">{label}</p>
          <div className="flex items-baseline gap-1 mt-1">
            {capacityMax ? (
              <span className="text-3xl font-bold dark:text-white text-gray-900 tracking-tighter">
                {value} <span className="text-xl dark:text-gray-400 text-gray-500 font-medium">/ {capacityMax}</span>
              </span>
            ) : (
              <span className="text-3xl font-bold dark:text-white text-gray-900 tracking-tighter">
                {value}
              </span>
            )}
            {unit && <span className="text-xs font-mono dark:text-gray-400 text-gray-500">{unit}</span>}
          </div>
        </div>
        <div className={cn(
          "px-1.5 py-0.5 mt-0.5 rounded text-[10px] font-bold font-mono",
          trend === "up" ? "dark:bg-green-500/20 bg-green-500/10 dark:text-green-400 text-green-600" : 
          trend === "down" ? "dark:bg-red-500/20 bg-red-500/10 dark:text-red-400 text-red-600" : 
          "dark:bg-gray-500/20 bg-gray-500/10 dark:text-gray-400 text-gray-600"
        )}>
          {trend === "up" ? "+12%" : trend === "down" ? "-5%" : "6%"}
        </div>
      </div>

      {capacityMax && (
        <div className="relative z-10 w-full h-1 bg-gray-200 dark:bg-gray-800 rounded-full mt-2 mb-2 overflow-hidden">
          <div 
            className="h-full rounded-full" 
            style={{ width: `${Math.min(100, (Number(value) / capacityMax) * 100)}%`, backgroundColor: color }} 
          />
        </div>
      )}

      <div className={cn("h-16 -mx-5 -mb-5 relative group-hover:scale-105 transition-transform duration-500", !capacityMax ? "mt-4" : "")}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id={`gradient-${label}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={color} stopOpacity={0.3}/>
                <stop offset="95%" stopColor={color} stopOpacity={0}/>
              </linearGradient>
            </defs>
            <Area 
              type="monotone" 
              dataKey="value" 
              stroke={color} 
              fillOpacity={1} 
              fill={`url(#gradient-${label})`} 
              strokeWidth={2}
              isAnimationActive={false}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
