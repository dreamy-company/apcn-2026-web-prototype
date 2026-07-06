interface IconProps {
  d: string;
  s?: number;
  c?: string;
  sw?: number;
  className?: string;
}

// Stroke-based icon renderer over the shared path map.
export default function Icon({ d, s = 20, c = 'currentColor', sw = 2, className }: IconProps) {
  return (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" className={`shrink-0 ${className ?? ''}`}>
      <path d={d} stroke={c} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
