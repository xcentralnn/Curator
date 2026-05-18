import { LogIn } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { CuratorLogo } from "../components/VisualBrand";
import { motion } from "motion/react";

export function Login() {
  const { signInWithGoogle } = useAuth();

  return (
    <div className="min-h-screen flex items-center justify-center bg-curator-bg dark:text-white text-gray-900 relative overflow-hidden technical-grid">
      {/* Background soft glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-curator-accent/5 blur-[120px] rounded-full pointer-events-none" />
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 w-full max-w-md p-8 md:p-12 dark:bg-curator-card bg-white border dark:border-curator-border border-gray-200 rounded-2xl shadow-2xl flex flex-col items-center"
      >
        <div className="w-20 h-20 mb-6">
          <CuratorLogo />
        </div>
        
        <div className="text-center mb-8">
          <h1 className="text-3xl font-black tracking-tighter mb-2">CURATOR SCALER</h1>
          <p className="dark:text-gray-400 text-gray-500 font-mono text-sm uppercase tracking-widest">K8s AI Operator Panel</p>
        </div>

        <div className="w-full dark:bg-white/5 bg-gray-50 border dark:border-white/5 border-gray-100 p-4 rounded-xl mb-8">
          <p className="text-xs text-center dark:text-gray-400 text-gray-500 leading-relaxed italic font-serif">
            "Welcome to the intelligent autoscaler. Please authenticate to access secure cluster operations."
          </p>
        </div>

        <button
          onClick={signInWithGoogle}
          className="w-full flex items-center justify-center gap-3 px-6 py-4 dark:bg-curator-accent/10 bg-curator-accent/5 hover:bg-curator-accent hover:text-white dark:hover:text-black text-curator-accent border dark:border-curator-accent/20 border-curator-accent/30 hover:border-curator-accent rounded-xl font-bold transition-all duration-300 group hover:shadow-[0_0_20px_rgba(52,152,219,0.3)] hover:-translate-y-1"
        >
          <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
            <path
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              fill="#4285F4"
            />
            <path
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              fill="#34A853"
            />
            <path
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              fill="#FBBC05"
            />
            <path
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              fill="#EA4335"
            />
          </svg>
          Sign in with Google
        </button>

        <p className="mt-8 text-xs text-gray-600 font-mono text-center">
          Secured by Identity Aware Proxy
        </p>
      </motion.div>
    </div>
  );
}
