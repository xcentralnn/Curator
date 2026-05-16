import { Moon, Sun } from "lucide-react";
import { useTheme } from "../contexts/ThemeContext";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <button
      onClick={() => setTheme(theme === "dark" || theme === "system" ? "light" : "dark")}
      className="relative p-2 text-gray-400 hover:text-white transition-colors rounded-lg hover:bg-white/5 border border-transparent hover:border-white/10"
      title="Toggle Theme"
    >
      <Sun className="h-5 w-5 dark:hidden block" />
      <Moon className="h-5 w-5 hidden dark:block" />
      <span className="sr-only">Toggle theme</span>
    </button>
  );
}
