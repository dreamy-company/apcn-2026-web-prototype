interface IconProps {
  d: string;
  s?: number;
  c?: string;
  sw?: number;
  fill?: string;
  className?: string;
}

export default function Icon({ d, s = 20, c = 'currentColor', sw = 2, fill = 'none', className }: IconProps) {
  const filled = fill !== 'none';
  return (
    <svg width={s} height={s} viewBox="0 0 24 24" fill={filled ? undefined : 'none'} className={`shrink-0 ${className ?? ''}`}>
      <path
        d={d}
        stroke={filled ? 'none' : c}
        strokeWidth={sw}
        strokeLinecap="round"
        strokeLinejoin="round"
        fill={filled ? c : 'none'}
      />
    </svg>
  );
}
