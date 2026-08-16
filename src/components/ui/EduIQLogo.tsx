import React from 'react';

interface EduIQLogoProps {
  size?: number;
  className?: string;
  showText?: boolean;
  textColor?: string;
}

export function EduIQLogo({ size = 28, className = '', showText = true, textColor = 'text-ink-950' }: EduIQLogoProps) {
  return (
    <div className={`inline-flex items-center gap-2.5 ${className}`}>
      <svg
        width={size}
        height={size}
        viewBox="0 0 40 40"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="flex-shrink-0 transition-transform duration-200 group-hover:scale-105"
      >
        <defs>
          <linearGradient id="eduiq-grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#4361EE" />
            <stop offset="100%" stopColor="#3A0CA3" />
          </linearGradient>
          <linearGradient id="node-glow" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#4CC9F0" />
            <stop offset="100%" stopColor="#4361EE" />
          </linearGradient>
        </defs>

        {/* Outer Rounded Container */}
        <rect width="40" height="40" rx="10" fill="url(#eduiq-grad)" />

        {/* Minimal Geometric "E" + Neural Node Structure */}
        {/* Top bar of E with neural node */}
        <rect x="10" y="10" width="20" height="4" rx="2" fill="white" />
        <circle cx="28" cy="12" r="3" fill="url(#node-glow)" />

        {/* Middle bar of E with connected pulse line */}
        <rect x="10" y="18" width="14" height="4" rx="2" fill="white" />
        <line x1="24" y1="20" x2="28" y2="28" stroke="url(#node-glow)" strokeWidth="2" strokeDasharray="2 2" />

        {/* Bottom bar of E with neural node */}
        <rect x="10" y="26" width="20" height="4" rx="2" fill="white" />
        <circle cx="28" cy="28" r="3.5" fill="#4CC9F0" />
        <circle cx="12" cy="12" r="1.5" fill="#4CC9F0" />
      </svg>

      {showText && (
        <span className={`font-display font-bold text-xl tracking-tight ${textColor}`}>
          Edu<span className="text-cobalt-600">IQ</span>
        </span>
      )}
    </div>
  );
}
