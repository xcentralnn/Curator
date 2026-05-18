/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { cn } from "../lib/utils";
import { Hexagon, Asterisk } from "lucide-react";

export function CuratorLogo({ className }: { className?: string }) {
  return (
    <div className={cn("w-full h-full min-w-8 min-h-8 rounded-xl bg-white dark:bg-[#1E293B] border border-gray-200 dark:border-slate-700 flex items-center justify-center shrink-0 drop-shadow-sm", className)}>
      <svg viewBox="0 0 100 100" className="w-[85%] h-[85%] drop-shadow-md">
        {/* Outer Hexagon outline with hollow space */}
        {/* Left inner wall */}
        <polygon points="50,4 10,27 10,73 50,50" fill="#58B3E6" />
        {/* Right inner wall */}
        <polygon points="50,4 90,27 90,73 50,50" fill="#3B87C1" />
        {/* Bottom inner wall */}
        <polygon points="10,73 50,96 90,73 50,50" fill="#2A648F" />

        {/* Inner floating White Cube to form the "Hollow Box" effect */}
        {/* Top Face */}
        <polygon points="50,25 70,36.5 50,48 30,36.5" fill="#FFFFFF" />
        {/* Left Face */}
        <polygon points="30,36.5 50,48 50,71.5 30,60" fill="#B7E2FA" />
        {/* Right Face */}
        <polygon points="50,48 70,36.5 70,60 50,71.5" fill="#82C2E8" />
      </svg>
    </div>
  );
}

export function MascotPlatypus({ className }: { className?: string }) {
  return (
    <div className={cn("relative shrink-0 flex items-center justify-center rounded-full bg-[#f6f5ec] dark:bg-[#242429] border-[3px] border-curator-accent dark:border-curator-accent shadow-[0_0_20px_rgba(52,152,219,0.5)] overflow-hidden transition-colors relative group", className || "w-16 h-16")}>
      <div className="absolute inset-0 bg-gradient-to-b from-[#f6f5ec] to-[#f6f5ec] dark:from-[#242429] dark:to-[#242429]" />
      <img 
        src="https://raw.githubusercontent.com/xcentralnn/Curator-Draft/main/docs/curator-logo.png" 
        alt="System Advisor Mascot" 
        referrerPolicy="no-referrer"
        className="absolute max-w-none transform transition-transform duration-500 group-hover:scale-105"
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          objectPosition: "center",
          filter: "contrast(1.1) saturate(1.1)",
          imageRendering: "-webkit-optimize-contrast"
        }}
      />
    </div>
  );
}

