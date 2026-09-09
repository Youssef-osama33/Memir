import React from "react";
import Link from "next/link";

interface BrandMarkProps {
  size?: "sm" | "md" | "lg";
  withTagline?: boolean;
  className?: string;
}

export function BrandMark({ size = "md", withTagline = false, className = "" }: BrandMarkProps) {
  const iconSizes = {
    sm: "w-7 h-7",
    md: "w-9 h-9",
    lg: "w-12 h-12",
  };

  const titleSizes = {
    sm: "text-xl",
    md: "text-2xl",
    lg: "text-4xl",
  };

  return (
    <div className={`inline-flex items-center gap-3 select-none ${className}`}>
      {/* Crafted Architectural Emblem */}
      <div className={`relative ${iconSizes[size]} flex-shrink-0 flex items-center justify-center bg-[#111111] text-white shadow-sm border border-black group-hover:bg-[#C86A00] transition-colors duration-300`}>
        {/* Geometric architectural motif */}
        <svg
          viewBox="0 0 32 32"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-4/5 h-4/5 text-current"
          aria-hidden="true"
        >
          {/* Architectural structural framing */}
          <rect x="4" y="4" width="24" height="24" stroke="currentColor" strokeWidth="1.5" />
          <polygon points="16,6 26,16 16,26 6,16" stroke="currentColor" strokeWidth="1.2" strokeDasharray="1 1" />
          {/* Central Keystone Anchor in signature amber */}
          <circle cx="16" cy="16" r="3" fill="#D97706" />
          <line x1="16" y1="4" x2="16" y2="28" stroke="currentColor" strokeWidth="1" strokeOpacity="0.4" />
          <line x1="4" y1="16" x2="28" y2="16" stroke="currentColor" strokeWidth="1" strokeOpacity="0.4" />
        </svg>
      </div>

      {/* Typography with Soul & Weight Contrast */}
      <div className="flex flex-col leading-none text-right">
        <span
          className={`font-serif font-black ${titleSizes[size]} text-[#111111] tracking-tight group-hover:text-[#C86A00] transition-colors duration-200`}
          style={{ fontFamily: "'Amiri', serif" }}
        >
          مِعمار
        </span>
        {withTagline && (
          <span className="text-[10px] font-sans font-bold text-neutral-500 tracking-wider mt-0.5">
            التحليلات والتقديرات الاستراتيجية
          </span>
        )}
      </div>
    </div>
  );
}
