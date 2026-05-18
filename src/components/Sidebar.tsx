import { LayoutDashboard, Activity, Database, History, Settings, ShieldAlert, Coffee, PlusCircle, ChevronLeft, ChevronRight, Hexagon, Box, Shield, ChevronDown } from "lucide-react";
import { useState } from "react";
import { cn } from "../lib/utils";
import { CuratorLogo } from "./VisualBrand";
import { useAdvisor } from "../contexts/AdvisorContext";

interface SidebarProps {
  activePage: string;
  setActivePage: (page: string) => void;
  className?: string;
  onClose?: () => void;
}

export function Sidebar({ activePage, setActivePage, className, onClose }: SidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isProductsCollapsed, setIsProductsCollapsed] = useState(true);
  const { addMessage } = useAdvisor();

  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "scalers", label: "Scalers", icon: Database },
    { id: "create-scaler", label: "Create Scaler", icon: PlusCircle },
    { id: "analytics", label: "ML Analytics", icon: Activity },
    { id: "logs", label: "Recommendation Logs", icon: History },
  ];

  const productItems = [
    { id: "observability", label: "Curator Scaler Observability", icon: Hexagon, color: "text-purple-500 dark:text-purple-400" },
    { id: "deployment", label: "Curator Scaler Deployment", icon: Box, color: "text-emerald-500 dark:text-emerald-400" },
    { id: "security", label: "Curator Scaler Security", icon: Shield, color: "text-amber-500 dark:text-amber-400" },
  ];

  const handleMenuClick = (id: string, label: string) => {
    setActivePage(id);
    if (id === 'create-scaler') {
      addMessage("I'm ready to help you configure a new Scaler. Need advice on setting custom metrics?", "info");
    } else if (id === 'analytics') {
      addMessage("Navigating to Scalers", "info");
    } else {
      addMessage(`Navigating to ${label}.`, "info");
    }
  };

  return (
    <div className={cn("h-full border-r dark:border-curator-border border-gray-200 dark:bg-curator-card bg-white flex flex-col p-4 relative overflow-hidden shrink-0 transition-all duration-300", 
      isCollapsed ? "w-20" : "w-72 md:w-80", 
      className)}>
      {/* Background soft glow */}
      <div className="absolute -top-20 -left-20 w-40 h-40 bg-curator-accent/5 blur-[80px] rounded-full pointer-events-none" />

      <div className={cn("flex items-center mb-8 px-2 group justify-between relative", isCollapsed ? "justify-center" : "")}>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 transition-transform duration-300 flex-shrink-0 cursor-pointer" onClick={() => isCollapsed && setIsCollapsed(false)}>
            <CuratorLogo />
          </div>
          {!isCollapsed && (
            <div className="flex flex-col">
              <h1 className="text-xl font-black tracking-tighter dark:text-white text-gray-900 transition-colors leading-none whitespace-nowrap">CURATOR SCALER</h1>
              <span className="text-[9px] font-bold tracking-widest text-gray-400 dark:text-gray-500 mt-1 uppercase">Software</span>
            </div>
          )}
        </div>
        
        {!isCollapsed && (
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="w-8 h-8 flex items-center justify-center rounded-lg bg-transparent dark:hover:bg-white/5 hover:bg-gray-100 transition-colors hidden md:flex text-gray-500 hover:text-gray-900 dark:hover:text-white focus:outline-none"
            title="Collapse"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
        )}

        {isCollapsed && (
          <button
            onClick={() => setIsCollapsed(false)}
            className="absolute -right-4 top-2 w-8 h-8 flex items-center justify-center rounded-full bg-white dark:bg-slate-800 border dark:border-slate-700 border-gray-200 transition-colors hidden md:flex text-gray-500 hover:text-gray-900 dark:hover:text-white shadow-md z-10"
            title="Expand"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        )}

        {!isCollapsed && onClose && (
          <button onClick={onClose} className="ml-auto md:hidden dark:text-gray-500 text-gray-400 dark:hover:text-white hover:text-gray-900 border border-gray-200 dark:border-white/10 p-1.5 rounded-full">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
          </button>
        )}
      </div>

      <div className="flex-1 overflow-y-auto pr-1 -mr-1 space-y-6">
        <div>
          {!isCollapsed && (
            <div className="px-3 mb-2">
              <p className="text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest whitespace-nowrap">CURATOR SCALER</p>
            </div>
          )}
          <nav className="space-y-1">
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleMenuClick(item.id, item.label)}
                title={isCollapsed ? item.label : undefined}
                className={cn(
                  "w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-300 group border",
                  isCollapsed ? "justify-center" : "",
                  activePage === item.id 
                    ? "bg-curator-accent/10 dark:text-white text-gray-900 border-curator-accent/20 shadow-[0_0_15px_rgba(52,152,219,0.15)]" 
                    : "border-transparent dark:text-gray-400 text-gray-500 dark:hover:text-white hover:text-gray-900 dark:hover:bg-white/5 hover:bg-gray-50 dark:hover:border-white/10 hover:border-gray-200 hover:-translate-y-0.5"
                )}
              >
                <item.icon className={cn("w-5 h-5 flex-shrink-0", activePage === item.id ? "text-curator-accent" : "dark:text-gray-500 text-gray-400 dark:group-hover:text-gray-300 group-hover:text-gray-900")} />
                {!isCollapsed && <span>{item.label}</span>}
                {!isCollapsed && activePage === item.id && (
                  <div className="ml-auto w-1 h-1 rounded-full bg-curator-accent" />
                )}
              </button>
            ))}
          </nav>
        </div>

        <div>
          {!isCollapsed ? (
            <button
              onClick={() => setIsProductsCollapsed(!isProductsCollapsed)}
              className="w-full flex items-center justify-between px-3 mb-2 group transition-colors focus:outline-none"
            >
              <p className="text-[10px] font-bold text-gray-500 dark:text-gray-500/80 uppercase tracking-widest group-hover:text-gray-700 dark:group-hover:text-gray-300 transition-colors whitespace-nowrap truncate mr-2">
                [CURATOR SCALER SYSTEM PRODUCTS]
              </p>
              <ChevronDown className={cn("w-3.5 h-3.5 text-gray-400 transition-transform duration-300 shrink-0", isProductsCollapsed && "-rotate-90")} />
            </button>
          ) : (
            <div className="flex justify-center mb-2" title="System Products">
               <div className="w-1.5 h-1.5 rounded-full bg-gray-400 dark:bg-gray-600" />
            </div>
          )}

          {(!isCollapsed && !isProductsCollapsed) && (
            <div className="space-y-0.5 mt-2">
              {productItems.map((item) => (
                <a
                  key={item.id}
                  href={`#${item.id}`}
                  className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium transition-all duration-300 group border border-transparent dark:text-gray-500 text-gray-500 dark:hover:text-gray-300 hover:text-gray-800 dark:hover:bg-white/5 hover:bg-gray-50 hover:-translate-y-0.5"
                >
                  <item.icon className={cn("w-4 h-4 flex-shrink-0 opacity-80", item.color)} />
                  <span className="truncate">{item.label}</span>
                </a>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Mascot Insight Widget */}
      <div className={cn("mt-auto mb-6 p-4 rounded-xl border dark:border-white/5 border-gray-100 relative group transition-all duration-300", 
        isCollapsed ? "bg-transparent p-2 flex justify-center border-transparent" : "bg-gradient-to-br dark:from-curator-accent/10 dark:to-transparent from-curator-accent/5 to-transparent")}>
        <div className={cn("flex flex-col items-start gap-2", isCollapsed ? "justify-center" : "")}>
          {isCollapsed ? (
            <Coffee className="w-5 h-5 text-curator-accent opacity-50" />
          ) : (
            <div className="flex-1 min-w-0">
              <p className="text-[10px] font-bold text-curator-accent uppercase tracking-widest mb-2 flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-curator-accent inline-block"></span>
                SYSTEM ADVISOR
              </p>
              <p className="text-[10px] dark:text-gray-400 text-gray-500 font-mono italic leading-relaxed">
                "Predicted traffic looks stable. Grab a coffee, I'm monitoring the pods."
              </p>
            </div>
          )}
        </div>
      </div>

      <div className="space-y-1">
        <button 
          title={isCollapsed ? "Settings" : undefined}
          className={cn("w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium dark:text-gray-400 text-gray-500 transition-all duration-300 border border-transparent dark:hover:text-white hover:text-gray-900 dark:hover:bg-white/5 hover:bg-gray-50 dark:hover:border-white/10 hover:border-gray-200 hover:-translate-y-0.5 group",
          isCollapsed ? "justify-center" : "")}>
          <Settings className="w-5 h-5 flex-shrink-0 dark:text-gray-500 text-gray-400 dark:group-hover:text-gray-300 group-hover:text-gray-900 transition-colors" />
          {!isCollapsed && <span>Settings</span>}
        </button>
        {!isCollapsed && (
          <div className="px-3 pt-6 pb-2">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-2 h-2 rounded-full bg-curator-accent animate-pulse" />
              <span className="text-[10px] font-mono dark:text-gray-400 text-gray-500 uppercase tracking-widest">Active Node: k8s-cl-01</span>
            </div>
            <p className="text-[10px] font-mono dark:text-gray-600 text-gray-400">PROD_ENV // v1.2.0-blue</p>
          </div>
        )}
      </div>
    </div>
  );
}
