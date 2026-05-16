/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { cn } from "../lib/utils";

export function CuratorLogo({ className }: { className?: string }) {
  return (
    <svg 
      viewBox="0 0 100 100" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg" 
      className={cn("w-full h-full", className)}
    >
      {/* Outer Glow / Base */}
      <path 
        d="M50 5L90 27.5V72.5L50 95L10 72.5V27.5L50 5Z" 
        stroke="#3498db" 
        strokeWidth="2" 
        strokeOpacity="0.3"
      />
      
      {/* Main Isometric Cube Shell */}
      <path d="M50 15L80 32V68L50 85L20 68V32L50 15Z" fill="#3498db" fillOpacity="0.2" />
      <path d="M50 15L80 32L50 49L20 32L50 15Z" fill="#3498db" fillOpacity="0.4" />
      <path d="M50 49V85L80 68V32L50 49Z" fill="#3498db" fillOpacity="0.6" />
      <path d="M20 32V68L50 85V49L20 32Z" fill="#3498db" fillOpacity="0.5" />

      {/* Inner Core Cube (The "Entity") */}
      <path d="M50 35L65 43.5V56.5L50 65L35 56.5V43.5L50 35Z" fill="white" fillOpacity="0.9" />
      <path d="M50 35L65 43.5L50 52L35 43.5L50 35Z" fill="white" />
      <path d="M50 52V65L65 56.5V43.5L50 52Z" fill="#E0F2FE" />
      <path d="M35 43.5V56.5L50 65V52L35 43.5Z" fill="#BAE6FD" />
      
      {/* Detail accents */}
      <path d="M50 15V49M80 32L50 49M20 32L50 49" stroke="#5AB0FF" strokeWidth="0.5" />
    </svg>
  );
}

export function MascotPlatypus({ className }: { className?: string }) {
  return (
    <div className={cn("relative group", className)}>
      {/* This is a symbolic representation of the mascot from the image */}
      <div className="w-12 h-12 bg-[#8B4513] rounded-full border-2 border-curator-border flex items-center justify-center overflow-hidden relative shadow-lg">
        {/* Simple Hat/Headphones shape */}
        <div className="absolute top-0 w-full h-1/2 bg-[#333] opacity-80" />
        {/* Face */}
        <div className="absolute bottom-2 w-8 h-4 bg-[#D4A373] rounded-full" />
        {/* Bill */}
        <div className="absolute bottom-4 w-10 h-3 bg-[#2D2D2D] rounded-full" />
      </div>
      {/* Coffee Mug Floating */}
      <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-white rounded-sm border border-gray-300 shadow-sm flex flex-col items-center">
        <div className="w-full h-1 bg-gray-100 mb-1" />
        <div className="w-1 h-2 bg-gray-200 absolute -right-1 top-1 rounded-r-md" />
      </div>
    </div>
  );
}
