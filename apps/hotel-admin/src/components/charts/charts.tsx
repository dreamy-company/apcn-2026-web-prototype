// Dependency-free SVG charts. Each scales via viewBox so containers control size.
import { useState } from 'react';

const BRAND = '#f15a24';
const BRAND_TOP = '#f7931e';

/** Smooth-ish revenue trend line with area fill and hover markers. */
export function LineChart({ data, labels }: { data: number[]; labels?: string[] }) {
  const [hover, setHover] = useState<number | null>(null);
  const W = 600;
  const H = 220;
  const PAD = { t: 16, r: 12, b: 26, l: 44 };
  const max = Math.max(...data, 1);
  const x = (i: number) => PAD.l + (i / (data.length - 1)) * (W - PAD.l - PAD.r);
  const y = (v: number) => H - PAD.b - (v / max) * (H - PAD.t - PAD.b);
  const points = data.map((v, i) => `${x(i)},${y(v)}`).join(' ');
  const area = `${PAD.l},${H - PAD.b} ${points} ${x(data.length - 1)},${H - PAD.b}`;
  const gridLines = [0.25, 0.5, 0.75, 1];

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full">
      <defs>
        <linearGradient id="lc-fill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={BRAND} stopOpacity="0.22" />
          <stop offset="100%" stopColor={BRAND} stopOpacity="0.02" />
        </linearGradient>
        <linearGradient id="lc-stroke" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor={BRAND} />
          <stop offset="100%" stopColor={BRAND_TOP} />
        </linearGradient>
      </defs>
      {gridLines.map((g) => (
        <g key={g}>
          <line x1={PAD.l} x2={W - PAD.r} y1={y(max * g)} y2={y(max * g)} stroke="#ece9e6" strokeWidth="1" />
          <text x={PAD.l - 6} y={y(max * g) + 3} textAnchor="end" fontSize="9" fontWeight="600" fill="#b8b3ab">
            {max * g >= 1000 ? `${Math.round((max * g) / 100) / 10}k` : Math.round(max * g)}
          </text>
        </g>
      ))}
      <polygon points={area} fill="url(#lc-fill)" />
      <polyline points={points} fill="none" stroke="url(#lc-stroke)" strokeWidth="2.5" strokeLinejoin="round" />
      {data.map((v, i) => (
        <g key={i}>
          {/* invisible wide hit area per point */}
          <rect
            x={x(i) - W / data.length / 2}
            y={0}
            width={W / data.length}
            height={H}
            fill="transparent"
            onMouseEnter={() => setHover(i)}
            onMouseLeave={() => setHover(null)}
          />
          {hover === i && (
            <>
              <line x1={x(i)} x2={x(i)} y1={PAD.t} y2={H - PAD.b} stroke={BRAND} strokeWidth="1" strokeDasharray="3 3" />
              <circle cx={x(i)} cy={y(v)} r="4.5" fill="#fff" stroke={BRAND} strokeWidth="2.5" />
              <g transform={`translate(${Math.min(Math.max(x(i) - 34, PAD.l), W - 90)}, ${PAD.t})`}>
                <rect width="78" height="24" rx="6" fill="#171717" />
                <text x="39" y="15.5" textAnchor="middle" fontSize="10" fontWeight="700" fill="#fff">
                  USD {v.toLocaleString()}
                </text>
              </g>
            </>
          )}
          {labels && (
            <text x={x(i)} y={H - 8} textAnchor="middle" fontSize="8.5" fontWeight="600" fill="#b8b3ab">
              {labels[i]}
            </text>
          )}
        </g>
      ))}
    </svg>
  );
}

const DONUT_COLORS = ['#f15a24', '#f7931e', '#ffb877', '#171717'];

/** Donut with configurable center readout; legend handled by the parent. */
export function DonutChart({
  data,
  centerLabel = 'total',
  centerValue,
}: {
  data: { name: string; count: number }[];
  centerLabel?: string;
  centerValue?: string;
}) {
  const total = data.reduce((s, d) => s + d.count, 0);
  const R = 70;
  const C = 2 * Math.PI * R;
  let acc = 0;
  return (
    <svg viewBox="0 0 200 200" className="w-full max-w-[220px]">
      {data.map((d, i) => {
        const frac = d.count / total;
        const dash = `${frac * C} ${C}`;
        const offset = -acc * C;
        acc += frac;
        return (
          <circle
            key={d.name}
            cx="100"
            cy="100"
            r={R}
            fill="none"
            stroke={DONUT_COLORS[i % DONUT_COLORS.length]}
            strokeWidth="26"
            strokeDasharray={dash}
            strokeDashoffset={offset}
            transform="rotate(-90 100 100)"
          />
        );
      })}
      <text x="100" y="96" textAnchor="middle" fontSize="26" fontWeight="800" fill="#1c1c1c">
        {centerValue ?? total}
      </text>
      <text x="100" y="114" textAnchor="middle" fontSize="10" fontWeight="600" fill="#8a8580">
        {centerLabel}
      </text>
    </svg>
  );
}

export const donutColor = (i: number) => DONUT_COLORS[i % DONUT_COLORS.length];

/** Vertical bars, e.g. check-in scans per congress day. */
export function BarChart({ data }: { data: { label: string; count: number }[] }) {
  const [hover, setHover] = useState<number | null>(null);
  const W = 420;
  const H = 190;
  const PAD = { t: 20, b: 26 };
  const max = Math.max(...data.map((d) => d.count), 1);
  const bw = (W / data.length) * 0.46;

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full">
      {data.map((d, i) => {
        const cx = (i + 0.5) * (W / data.length);
        const h = (d.count / max) * (H - PAD.t - PAD.b);
        return (
          <g key={d.label} onMouseEnter={() => setHover(i)} onMouseLeave={() => setHover(null)}>
            <rect
              x={cx - bw / 2}
              y={H - PAD.b - h}
              width={bw}
              height={h}
              rx="7"
              fill={hover === i ? '#f15a24' : '#f7931e'}
              opacity={hover === null || hover === i ? 1 : 0.45}
            />
            <text x={cx} y={H - PAD.b - h - 6} textAnchor="middle" fontSize="11" fontWeight="800" fill="#1c1c1c">
              {d.count}
            </text>
            <text x={cx} y={H - 8} textAnchor="middle" fontSize="9.5" fontWeight="700" fill="#8a8580">
              {d.label}
            </text>
          </g>
        );
      })}
    </svg>
  );
}
