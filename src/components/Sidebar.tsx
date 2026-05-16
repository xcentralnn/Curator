import { LayoutDashboard, Activity, Database, History, Settings, ShieldAlert, Coffee } from "lucide-react";
import { cn } from "../lib/utils";
import { CuratorLogo, MascotPlatypus } from "./VisualBrand";

interface SidebarProps {
  activePage: string;
  setActivePage: (page: string) => void;
  className?: string;
  onClose?: () => void;
}

export function Sidebar({ activePage, setActivePage, className, onClose }: SidebarProps) {
  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "scalers", label: "Scalers", icon: Database },
    { id: "analytics", label: "ML Analytics", icon: Activity },
    { id: "logs", label: "Recommendation Logs", icon: History },
  ];

  return (
    <div className={cn("w-64 md:w-68 h-full border-r dark:border-curator-border border-gray-200 dark:bg-curator-card bg-white flex flex-col p-4 relative overflow-hidden shrink-0", className)}>
      {/* Background soft glow */}
      <div className="absolute -top-20 -left-20 w-40 h-40 bg-curator-accent/5 blur-[80px] rounded-full pointer-events-none" />

      <div className="flex items-center gap-3 mb-10 px-2 group cursor-pointer justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 group-hover:scale-110 transition-transform duration-300">
            <CuratorLogo />
          </div>
          <h1 className="text-xl font-black tracking-tighter dark:text-white text-gray-900 group-hover:text-curator-accent transition-colors">CURATOR</h1>
        </div>
        {onClose && (
          <button onClick={onClose} className="md:hidden dark:text-gray-500 text-gray-400 dark:hover:text-white hover:text-gray-900">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
          </button>
        )}
      </div>

      <nav className="flex-1 space-y-1">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActivePage(item.id)}
            className={cn(
              "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-300 group border",
              activePage === item.id 
                ? "bg-curator-accent/10 dark:text-white text-gray-900 border-curator-accent/20 shadow-[0_0_15px_rgba(52,152,219,0.15)]" 
                : "border-transparent dark:text-gray-400 text-gray-500 dark:hover:text-white hover:text-gray-900 dark:hover:bg-white/5 hover:bg-gray-50 dark:hover:border-white/10 hover:border-gray-200 hover:-translate-y-0.5"
            )}
          >
            <item.icon className={cn("w-4 h-4", activePage === item.id ? "text-curator-accent" : "dark:text-gray-500 text-gray-400 dark:group-hover:text-gray-300 group-hover:text-gray-900")} />
            {item.label}
            {activePage === item.id && (
              <div className="ml-auto w-1 h-1 rounded-full bg-curator-accent" />
            )}
          </button>
        ))}
      </nav>

      {/* Mascot Insight Widget */}
      <div className="mt-auto mb-6 p-4 rounded-xl bg-gradient-to-br from-curator-accent/5 to-transparent border dark:border-white/5 border-gray-100 relative group">
        <div className="flex items-start gap-3">
          <MascotPlatypus className="shrink-0" />
          <div className="flex-1 min-w-0">
            <p className="text-[10px] font-bold text-curator-accent uppercase tracking-widest mb-1 flex items-center gap-1">
              <Coffee className="w-3 h-3" /> System Advisor
            </p>
            <p className="text-[10px] dark:text-gray-500 text-gray-500 font-mono italic leading-tight">
              "Predicted traffic looks stable. Grab a coffee, I'm monitoring the pods."
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-1">
        <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium dark:text-gray-400 text-gray-500 transition-all duration-300 border border-transparent dark:hover:text-white hover:text-gray-900 dark:hover:bg-white/5 hover:bg-gray-50 dark:hover:border-white/10 hover:border-gray-200 hover:-translate-y-0.5 group">
          <Settings className="w-4 h-4 dark:text-gray-500 text-gray-400 dark:group-hover:text-gray-300 group-hover:text-gray-900 transition-colors" />
          Settings
        </button>
        <div className="px-3 pt-6 pb-2">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-2 h-2 rounded-full bg-curator-accent animate-pulse" />
            <span className="text-[10px] font-mono dark:text-gray-400 text-gray-500 uppercase tracking-widest">Active Node: k8s-cl-01</span>
          </div>
          <p className="text-[10px] font-mono dark:text-gray-600 text-gray-400">PROD_ENV // v1.2.0-blue</p>
        </div>
      </div>
    </div>
  );
}
