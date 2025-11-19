'use client';

export default function Logo() {
  return (
    <div className="flex flex-col items-center gap-3">
      <svg
        viewBox="0 0 200 200"
        fill="none"
        className="w-48 h-48 md:w-56 md:h-56 lg:w-64 lg:h-64"
      >
        <defs>
          <filter id="glow">
            <feGaussianBlur stdDeviation="4" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        <circle
          cx="100"
          cy="100"
          r="55"
          fill="none"
          stroke="#FFFFFF"
          strokeWidth="4"
          filter="url(#glow)"
          className="animate-draw-circle"
        />
        <text
          x="100"
          y="125"
          fontFamily="system-ui"
          fontSize="80"
          fontWeight="900"
          fill="none"
          stroke="#818CF8"
          strokeWidth="2"
          textAnchor="middle"
          filter="url(#glow)"
        >
          S
        </text>
      </svg>
      <div className="text-[#818CF8] text-3xl md:text-4xl font-light tracking-[0.3em] uppercase" style={{ textShadow: '0 0 8px rgba(129, 140, 248, 0.5)' }}>
        SHUTO
      </div>
    </div>
  );
}
