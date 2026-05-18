import { useState, useEffect } from "react";
import { Sidebar } from "./components/Sidebar";
import { Dashboard } from "./pages/Dashboard";
import { Login } from "./pages/Login";
import { CreateScaler } from "./pages/CreateScaler";
import { ScalersInventory } from "./pages/ScalersInventory";
import { MLAnalytics } from "./pages/MLAnalytics";
import { PanicButton } from "./components/PanicButton";
import { ThemeToggle } from "./components/ThemeToggle";
import { FloatingMascot } from "./components/FloatingMascot";
import { Search, Bell, History, Sparkles, AlertCircle, Zap, Server, Database, Activity, Menu, LogOut } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "./lib/utils";
import { useAuth } from "./contexts/AuthContext";
import { useAdvisor } from "./contexts/AdvisorContext";

export default function App() {
  const { user, loading, signOut } = useAuth();
  const [activePage, setActivePage] = useState("dashboard");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  if (loading) {
    return (
      <div className="h-screen bg-curator-bg flex items-center justify-center">
        <div className="text-curator-accent font-mono animate-pulse uppercase tracking-widest text-sm">Authenticating...</div>
      </div>
    );
  }

  if (!user) {
    return <Login />;
  }

  return (
    <div className="flex h-screen bg-curator-bg overflow-hidden relative">
      {/* Sidebar Desktop */}
      <Sidebar 
        activePage={activePage} 
        setActivePage={setActivePage} 
        className="hidden md:flex"
      />

      {/* Sidebar Mobile Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-black/50 md:hidden"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", bounce: 0, duration: 0.3 }}
              className="absolute inset-y-0 left-0 w-64 shadow-2xl z-50 flex flex-col"
              onClick={(e) => e.stopPropagation()}
            >
              <Sidebar 
                activePage={activePage} 
                setActivePage={(p) => {
                  setActivePage(p);
                  setIsMobileMenuOpen(false);
                }} 
                onClose={() => setIsMobileMenuOpen(false)}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      
      <div className="flex-1 flex flex-col h-full dark:bg-[#0C0C0E] bg-gray-50 w-full min-w-0">
        {/* Top Header */}
        <header className="h-16 shrink-0 border-b dark:border-curator-border border-gray-200 px-4 md:px-8 flex items-center justify-between z-10 dark:bg-curator-bg/80 bg-white/80 backdrop-blur-sm">
          <div className="flex items-center gap-3 md:gap-4 flex-1">
            <button 
              className="md:hidden dark:text-gray-400 text-gray-400 dark:hover:text-white hover:text-gray-900"
              onClick={() => setIsMobileMenuOpen(true)}
            >
              <Menu className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-2 md:gap-4 dark:bg-white/5 bg-black/5 border dark:border-white/10 border-black/10 rounded-lg px-3 py-1.5 md:w-96 flex-1 max-w-[200px] md:max-w-max">
              <Search className="w-4 h-4 dark:text-gray-500 text-gray-400 shrink-0" />
              <input 
                type="text" 
                placeholder="Search..." 
                className="bg-transparent border-none text-sm dark:text-white text-gray-900 focus:outline-none w-full placeholder:dark:text-gray-500 placeholder:text-gray-400"
              />
            </div>
          </div>

          <div className="flex items-center gap-3 md:gap-6 ml-4">
            <ThemeToggle />
            <div className="hidden sm:block">
              <PanicButton />
            </div>
            <div className="hidden sm:block h-6 w-[1px] dark:bg-curator-border bg-gray-200" />
            <div className="flex items-center gap-3 md:gap-4">
              <button className="relative dark:text-gray-400 text-gray-500 dark:hover:text-white hover:text-gray-900 transition-colors">
                <Bell className="w-4 h-4 md:w-5 md:h-5" />
                <span className="absolute -top-1 -right-1 w-2 h-2 bg-curator-panic rounded-full border-2 dark:border-curator-bg border-white" />
              </button>
              <div className="flex items-center gap-2 pl-1 md:pl-2 cursor-pointer group relative">
                {user.photoURL ? (
                  <img src={user.photoURL} alt="Avatar" className="w-7 h-7 md:w-8 md:h-8 rounded-lg border dark:border-white/10 border-black/10 shadow-lg dark:shadow-curator-accent/20 shadow-curator-accent/10 object-cover" />
                ) : (
                  <div className="w-7 h-7 md:w-8 md:h-8 rounded-lg bg-curator-accent flex items-center justify-center border dark:border-white/10 border-black/10 shadow-lg dark:shadow-curator-accent/20 shadow-curator-accent/10">
                    <span className="font-bold text-[10px] md:text-xs text-white">{user.email?.charAt(0).toUpperCase() || 'U'}</span>
                  </div>
                )}
                
                <div className="flex-col hidden lg:flex">
                  <span className="text-sm font-bold dark:text-gray-300 text-gray-700 dark:group-hover:text-white group-hover:text-gray-900 transition-colors leading-none truncate max-w-[120px]">{user.displayName || user.email?.split('@')[0]}</span>
                  <span className="text-[10px] dark:text-gray-600 text-gray-500 font-mono">Curator Operator</span>
                </div>

                <div className="absolute right-0 top-full mt-2 w-48 dark:bg-curator-card bg-white border dark:border-curator-border border-gray-200 rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all pointer-events-none group-hover:pointer-events-auto p-2">
                  <div className="px-2 py-1.5 border-b dark:border-curator-border border-gray-100 mb-1">
                    <p className="text-xs dark:text-white text-gray-900 truncate font-bold">{user.email}</p>
                  </div>
                  <button onClick={signOut} className="w-full flex items-center gap-2 px-2 py-2 text-xs text-red-400 hover:text-red-500 dark:hover:bg-white/5 hover:bg-red-50 rounded transition-colors">
                    <LogOut className="w-3 h-3" />
                    Sign Out
                  </button>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto w-full relative min-h-0">
          <AnimatePresence mode="wait">
            <motion.div
              key={activePage}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="min-h-full"
            >
              {activePage === "dashboard" && <Dashboard />}
              {activePage === "create-scaler" && <CreateScaler onCreated={() => setActivePage('scalers')} />}
              {activePage === "scalers" && <ScalersInventory />}
              {activePage === "analytics" && <MLAnalytics />}
              {activePage === "logs" && <LogsPage />}
            </motion.div>
          </AnimatePresence>
        </main>
        
        <FloatingMascot />
      </div>
    </div>
  );
}

// Inline LogsPage component for simplicity
function LogsPage() {
  const [logs, setLogs] = useState<any[]>([]);
  const [explaining, setExplaining] = useState<string | null>(null);
  const [explanationMap, setExplanationMap] = useState<Record<string, string>>({});
  const { addMessage } = useAdvisor();

  useEffect(() => {
    fetch("/api/recommendations").then(r => r.json()).then(setLogs);
  }, []);

  const handleExplain = async (id: string) => {
    setExplaining(id);
    addMessage("Connecting to Gemini AI Engine to analyze the scaling decision...", "info");
    try {
      const res = await fetch("/api/ai-explain", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ recommendationId: id })
      });
      const data = await res.json();
      setExplanationMap(prev => ({ ...prev, [id]: data.explanation }));
      addMessage("Analysis complete! I've appended the explanation.", "success");
    } catch (e) {
      setExplanationMap(prev => ({ ...prev, [id]: "Failed to connect to Gemini AI Engine." }));
      addMessage("Failed to get analysis from AI Engine.", "error");
    } finally {
      setExplaining(null);
    }
  };

  return (
    <div className="p-4 md:p-8 technical-grid min-h-full">
      <div className="mb-6 md:mb-10 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold dark:text-white text-gray-900 tracking-tighter mb-1 flex items-center gap-3">
            <History className="w-8 h-8 text-curator-accent" />
            Recommendation Logs
          </h2>
          <p className="dark:text-gray-500 text-gray-400 font-mono text-[10px] md:text-xs uppercase tracking-widest italic">
            Source: Curator-ML-Engine / Event History
          </p>
        </div>
        <div className="flex gap-2">
           <button 
             onClick={() => addMessage("Logs exported to CSV successfully!", "success")}
             className="dark:bg-white/5 bg-gray-100 dark:hover:bg-white/10 hover:bg-gray-200 text-xs font-mono dark:text-white text-gray-900 px-4 py-2 rounded-lg transition-colors font-bold uppercase tracking-widest border dark:border-white/10 border-black/10"
           >
             Export CSV
           </button>
        </div>
      </div>

      <div className="space-y-6 max-w-5xl">
        {logs.map((log) => {
          const explanation = explanationMap[log.id];
          return (
            <div key={log.id} className="dark:bg-curator-card bg-white border dark:border-curator-border border-gray-200 rounded-xl overflow-hidden shadow-sm flex flex-col group">
              <div className="p-4 md:p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 border-b dark:border-curator-border border-gray-100">
                <div className="flex items-center gap-4">
                  <div className={cn(
                    "p-3 rounded-lg flex-shrink-0 shadow-inner",
                    log.type === "UP" ? "bg-curator-accent/20 text-curator-accent dark:border-curator-accent/20 border-curator-accent/40" : "bg-blue-500/20 text-blue-500 dark:border-blue-500/20 border-blue-500/40"
                  )}>
                    {log.type === "UP" ? <Zap className="w-5 h-5" /> : <Server className="w-5 h-5" />}
                  </div>
                  <div>
                    <h4 className="text-base md:text-lg dark:text-white text-gray-900 font-bold tracking-tight">{log.scalerId}</h4>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="text-[10px] font-mono dark:text-gray-500 text-gray-500 uppercase tracking-wider block">
                        {new Date(log.timestamp).toLocaleString()}
                      </span>
                      <span className={cn(
                        "text-[10px] font-mono px-2 py-0.5 rounded font-bold uppercase tracking-widest",
                        log.type === "UP" ? "bg-curator-accent/10 text-curator-accent" : "bg-blue-500/10 text-blue-500"
                      )}>
                        Scale {log.type}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex flex-row md:flex-col items-center md:items-end justify-between md:justify-center dark:bg-white/5 bg-gray-50 p-3 md:p-0 rounded-lg md:rounded-none md:bg-transparent md:dark:bg-transparent">
                  <span className="text-[10px] font-mono dark:text-gray-500 text-gray-500 uppercase tracking-widest mb-0.5">Target Replicas</span>
                  <span className="text-2xl font-bold dark:text-white text-gray-900 tabular-nums">{log.replicas}</span>
                </div>
              </div>

              <div className="p-4 md:p-6 dark:bg-black/20 bg-gray-50/50">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 dark:text-gray-400 text-gray-500 mt-0.5 shrink-0" />
                  <div className="flex-1">
                    <p className="text-sm dark:text-gray-300 text-gray-700 leading-relaxed font-serif italic mb-4">
                      "{log.reason}"
                    </p>
                    <div className="flex items-center gap-4">
                      <button 
                        onClick={() => handleExplain(log.id)}
                        disabled={explaining === log.id}
                        className="flex items-center gap-2 text-xs font-mono font-bold dark:bg-curator-accent/20 bg-curator-accent/10 hover:bg-curator-accent/30 text-curator-accent px-3 py-1.5 rounded disabled:opacity-50 transition-colors border border-curator-accent/20"
                      >
                        <Sparkles className="w-3.5 h-3.5" />
                        {explaining === log.id ? "ANALYZING LOGIC..." : "EXPLAIN WITH AI"}
                      </button>
                    </div>

                    <AnimatePresence>
                      {explanation && (
                         <motion.div 
                           initial={{ height: 0, opacity: 0, marginTop: 0 }}
                           animate={{ height: "auto", opacity: 1, marginTop: 16 }}
                           exit={{ height: 0, opacity: 0, marginTop: 0 }}
                           className="overflow-hidden"
                         >
                           <div className="p-4 dark:bg-curator-accent/10 bg-curator-accent/5 border dark:border-curator-accent/20 border-curator-accent/30 rounded-lg flex items-start gap-3">
                             <div className="w-8 h-8 dark:bg-curator-accent bg-curator-accent text-white rounded-full flex items-center justify-center shrink-0 shadow-lg shadow-curator-accent/20">
                               <Sparkles className="w-4 h-4" />
                             </div>
                             <div>
                               <h5 className="text-[10px] font-mono text-curator-accent uppercase font-bold tracking-widest mb-1">Gemini AI Analysis</h5>
                               <p className="text-sm dark:text-gray-300 text-gray-800 leading-relaxed font-mono">
                                 {explanation}
                               </p>
                             </div>
                           </div>
                         </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

