"use client";

export function Sparkline({ color = "#c9a84c" }: { color?: string }) {
  // Courbe sparkline décorative croissante
  const points = [0, 15, 8, 22, 18, 30, 25, 38, 32, 45, 40, 50];
  const w = 80, h = 32;
  const max = Math.max(...points);
  const coords = points.map((p, i) => {
    const x = (i / (points.length - 1)) * w;
    const y = h - (p / max) * h;
    return `${x},${y}`;
  });
  const polyline = coords.join(" ");

  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} fill="none">
      <defs>
        <linearGradient id={`sg-${color.replace("#","")}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.3" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <polygon
        points={`0,${h} ${polyline} ${w},${h}`}
        fill={`url(#sg-${color.replace("#","")})`}
      />
      <polyline points={polyline} stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
