import { Moon, Sun, Monitor, Palette } from "lucide-react";
import { useTheme } from "../contexts/ThemeContext";
import { useState, useRef, useEffect } from "react";
import { cn } from "../lib/utils";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 dark:text-gray-400 text-gray-500 dark:hover:text-white hover:text-gray-900 transition-colors rounded-lg dark:hover:bg-white/5 hover:bg-black/5 border border-transparent dark:hover:border-white/10 hover:border-black/10"
        title="Toggle Theme"
      >
        <Palette className="h-5 w-5" />
        <span className="sr-only">Select theme</span>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-36 dark:bg-curator-card bg-white border dark:border-curator-border border-gray-200 rounded-lg shadow-xl overflow-hidden py-1 z-50">
          <button
            onClick={() => { setTheme("light"); setIsOpen(false); }}
            className={cn(
              "w-full flex items-center gap-2 px-3 py-2 text-sm transition-colors",
              theme === "light" ? "dark:bg-white/10 bg-gray-100 dark:text-white text-gray-900 font-medium" : "dark:text-gray-400 text-gray-600 dark:hover:bg-white/5 hover:bg-gray-50"
            )}
          >
            <Sun className="w-4 h-4" /> Light
          </button>
          <button
            onClick={() => { setTheme("dark"); setIsOpen(false); }}
            className={cn(
              "w-full flex items-center gap-2 px-3 py-2 text-sm transition-colors",
              theme === "dark" ? "dark:bg-white/10 bg-gray-100 dark:text-white text-gray-900 font-medium" : "dark:text-gray-400 text-gray-600 dark:hover:bg-white/5 hover:bg-gray-50"
            )}
          >
            <Moon className="w-4 h-4" /> Dark
          </button>
          <button
            onClick={() => { setTheme("system"); setIsOpen(false); }}
            className={cn(
              "w-full flex items-center gap-2 px-3 py-2 text-sm transition-colors",
              theme === "system" ? "dark:bg-white/10 bg-gray-100 dark:text-white text-gray-900 font-medium" : "dark:text-gray-400 text-gray-600 dark:hover:bg-white/5 hover:bg-gray-50"
            )}
          >
            <Monitor className="w-4 h-4" /> System
          </button>
        </div>
      )}
    </div>
  );
}
