import { AnimatePresence, motion } from 'framer-motion';
import { useAdvisor } from '../contexts/AdvisorContext';
import { MascotPlatypus } from './VisualBrand';
import { cn } from '../lib/utils';
import { X, Sparkles } from 'lucide-react';
import { useState } from 'react';

export function FloatingMascot() {
  const { message, clearMessage, addMessage } = useAdvisor();
  const [isHovered, setIsHovered] = useState(false);

  const isActive = !!message;

  const handleMascotClick = () => {
    if (!isActive) {
      const greetings = [
        "Welcome back! I'm monitoring the cluster.",
        "All systems are running smoothly right now.",
        "Need to scale up? Just let me know!",
        "Curator Scaler ML Engine is online and vigilant.",
        "Analyzing real-time metrics... looks good!"
      ];
      const randomGreeting = greetings[Math.floor(Math.random() * greetings.length)];
      addMessage(randomGreeting, 'info');
    }
  };

  return (
    <div className="fixed bottom-8 right-8 z-50 flex flex-col items-end justify-end pointer-events-none w-72">
      <AnimatePresence>
        {message && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.9 }}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
            className={cn(
              "relative mb-4 p-4 rounded-xl shadow-2xl min-w-[240px] max-w-[320px] sm:max-w-sm border pointer-events-auto origin-bottom-right z-[100]",
              message.type === 'error' ? "bg-red-50 dark:bg-red-900/10 border-red-200 dark:border-red-500/30 text-red-800 dark:text-red-200" :
              message.type === 'success' ? "bg-green-50 dark:bg-green-900/10 border-green-200 dark:border-green-500/30 text-green-800 dark:text-green-200" :
              message.type === 'warning' ? "bg-orange-50 dark:bg-orange-900/10 border-orange-200 dark:border-orange-500/30 text-orange-800 dark:text-orange-200" :
              "dark:bg-[#14171d]/95 backdrop-blur-md bg-white border-gray-200 dark:border-white/10 dark:text-gray-200 text-gray-800"
            )}
          >
            {/* Tail of speech bubble */}
            <div className={cn(
              "absolute -bottom-2 right-8 w-4 h-4 rotate-45 border-r border-b",
              message.type === 'error' ? "bg-red-50 dark:bg-red-900 border-red-200 dark:border-red-500/30" :
              message.type === 'success' ? "bg-green-50 dark:bg-green-900 border-green-200 dark:border-green-500/30" :
              message.type === 'warning' ? "bg-orange-50 dark:bg-orange-900 border-orange-200 dark:border-orange-500/30" :
              "dark:bg-[#14171d] bg-white border-gray-200 dark:border-white/10"
            )} />
            
            <button 
              onClick={clearMessage}
              className="absolute top-2 right-2 p-1 rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
            >
              <X className="w-3.5 h-3.5 opacity-50" />
            </button>

            <div className="flex items-start gap-3 pr-4">
               {(message.type === 'info' || !message.type) && (
                 <div className="p-2 rounded-full bg-blue-50 dark:bg-curator-accent/20 shrink-0 mt-0.5">
                    <Sparkles className="w-4 h-4 text-curator-accent" />
                 </div>
               )}
               {message.type === 'success' && (
                 <div className="p-2 rounded-full bg-green-50 dark:bg-green-500/20 shrink-0 mt-0.5">
                    <Sparkles className="w-4 h-4 text-green-500" />
                 </div>
               )}
               {message.type === 'warning' && (
                 <div className="p-2 rounded-full bg-orange-50 dark:bg-orange-500/20 shrink-0 mt-0.5">
                    <Sparkles className="w-4 h-4 text-orange-500" />
                 </div>
               )}
               {message.type === 'error' && (
                 <div className="p-2 rounded-full bg-red-50 dark:bg-red-500/20 shrink-0 mt-0.5">
                    <X className="w-4 h-4 text-red-500" />
                 </div>
               )}
               <p className="text-[13px] font-medium leading-relaxed font-sans text-left pt-2 text-gray-700 dark:text-gray-300">
                  {message.text}
               </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Animated Mascot */}
      <motion.div 
        className="flex flex-col items-end pointer-events-auto cursor-pointer group relative"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={handleMascotClick}
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 300, damping: 25, delay: 0.5 }}
      >
        <motion.div 
           className="w-20 h-20 sm:w-24 sm:h-24 shrink-0 relative z-20"
           animate={
             isActive 
               ? { y: 0, scale: 1 } 
               : isHovered 
                 ? { y: -2, scale: 1.05 } 
                 : { y: [0, -3, 0] }
           }
           transition={
             isActive 
               ? { type: "spring", stiffness: 400, damping: 25 }
               : isHovered
                 ? { type: "spring", stiffness: 400, damping: 10 }
                 : { repeat: Infinity, duration: 4, ease: "easeInOut" }
           }
        >
          {/* Subtle metallic bright blue highlight border */}
          <div className="w-full h-full rounded-full bg-[#f6f5ec] dark:bg-[#e6e2d3] border-[3px] border-curator-accent dark:border-curator-accent shadow-[0_0_20px_rgba(52,152,219,0.5)] overflow-hidden transition-colors relative flex items-center justify-center">
            {/* Cozy background animation: dynamic network grid/racks */}
            <div className="absolute inset-0 bg-gradient-to-b from-[#f6f5ec] to-[#f6f5ec] dark:from-[#242429] dark:to-[#242429]" />
            <motion.img 
              src="https://raw.githubusercontent.com/xcentralnn/Curator-Draft/main/docs/curator-logo.png" 
              alt="System Advisor Mascot" 
              referrerPolicy="no-referrer"
              className="absolute max-w-none w-[100%] h-[100%] object-cover object-center filter contrast-110 saturate-110"
              style={{ imageRendering: "-webkit-optimize-contrast", transformOrigin: "center" }}
              animate={{ 
                rotate: [0, -2, 2, 0],
                scale: [1, 1.02, 1] 
              }}
              transition={{ repeat: Infinity, duration: 5, ease: "easeInOut" }}
            />
          </div>
          
          {/* Centered Pill Badge at the bottom center of the circular avatar */}
          <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-1.5 h-8 bg-white dark:bg-[#14171d] border border-gray-200 dark:border-white/10 rounded-full px-3 shadow-xl z-30 transition-transform hover:scale-105">
            {/* Active/Online status dot */}
            <div className="w-2.5 h-2.5 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]" />
            
            <div className="w-4 h-4 shrink-0 opacity-90 mx-0.5">
               {/* Approximate Curator isometric cube using inline SVG similar to VisualBrand */}
               <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md">
                  <polygon points="50,4 10,27 10,73 50,50" fill="#58B3E6" />
                  <polygon points="50,4 90,27 90,73 50,50" fill="#3B87C1" />
                  <polygon points="10,73 50,96 90,73 50,50" fill="#2A648F" />
                  <polygon points="50,25 70,36.5 50,48 30,36.5" fill="#FFFFFF" />
                  <polygon points="30,36.5 50,48 50,71.5 30,60" fill="#B7E2FA" />
                  <polygon points="50,48 70,36.5 70,60 50,71.5" fill="#82C2E8" />
               </svg>
            </div>

            <span className="font-bold text-[10px] text-gray-900 dark:text-white tracking-widest uppercase whitespace-nowrap">Curator Scaler</span>
          </div>

          {/* Glow effect when active */}
          {isActive && (
            <motion.div 
              className="absolute inset-0 rounded-full bg-curator-accent/50 filter blur-2xl -z-10"
              animate={{ opacity: [0.4, 0.8, 0.4] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
            />
          )}
        </motion.div>
      </motion.div>
    </div>
  );
}
