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
}

export function MetricCard({ label, value, unit, data, trend, color = "#00FF9C" }: MetricCardProps) {
  return (
    <div className="dark:bg-curator-card bg-white border dark:border-curator-border border-gray-200 p-5 rounded-xl overflow-hidden relative group">
      <div className="absolute inset-0 bg-gradient-to-br dark:from-white/[0.02] from-black/[0.02] to-transparent pointer-events-none" />
      
      <div className="relative z-10 flex justify-between items-start mb-4">
        <div>
          <p className="text-xs font-mono dark:text-gray-500 text-gray-500 uppercase tracking-widest mb-1">{label}</p>
          <div className="flex items-baseline gap-1">
            <span className="text-3xl font-bold dark:text-white text-gray-900 tracking-tighter">{value}</span>
            {unit && <span className="text-sm font-mono dark:text-gray-400 text-gray-500">{unit}</span>}
          </div>
        </div>
        <div className={cn(
          "px-2 py-1 rounded text-[10px] font-bold font-mono",
          trend === "up" ? "bg-green-500/10 text-green-500" : 
          trend === "down" ? "bg-red-500/10 text-red-500" : 
          "bg-gray-500/10 text-gray-500"
        )}>
          {trend === "up" ? "+12%" : trend === "down" ? "-5%" : "0%"}
        </div>
      </div>

      <div className="h-20 -mx-5 -mb-5 relative group-hover:scale-105 transition-transform duration-500">
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
