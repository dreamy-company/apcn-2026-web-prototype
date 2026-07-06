const DEEP = '#171717';
const DATA: [number, number][] = [
  [8, 9], [8, 10], [8, 11], [8, 13], [8, 15], [8, 17], [9, 8], [9, 10], [9, 11], [9, 12], [9, 16], [9, 18],
  [10, 9], [10, 11], [10, 12], [10, 13], [10, 14], [10, 17], [11, 8], [11, 9], [11, 10], [11, 12], [11, 15], [11, 18],
  [12, 9], [12, 10], [12, 11], [12, 13], [12, 16], [12, 17], [14, 8], [14, 9], [14, 11], [14, 13], [14, 15], [14, 17],
  [14, 18], [15, 10], [15, 12], [15, 14], [15, 16], [15, 18], [16, 8], [16, 9], [16, 11], [16, 13], [16, 14], [16, 17],
  [17, 10], [17, 12], [17, 15], [17, 16], [17, 18], [18, 8], [18, 9], [18, 11], [18, 13], [18, 15], [18, 16], [18, 18],
];

function Finder({ c, x, y }: { c: number; x: number; y: number }) {
  return (
    <>
      <rect x={c * x} y={c * y} width={c * 7} height={c * 7} rx={c * 0.9} fill={DEEP} />
      <rect x={c * (x + 1)} y={c * (y + 1)} width={c * 5} height={c * 5} rx={c * 0.5} fill="white" />
      <rect x={c * (x + 2)} y={c * (y + 2)} width={c * 3} height={c * 3} rx={c * 0.35} fill={DEEP} />
    </>
  );
}

export default function QRCode({ size = 140 }: { size?: number }) {
  const c = size / 21;
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="block">
      <rect width={size} height={size} fill="white" rx="6" />
      <Finder c={c} x={1} y={1} />
      <Finder c={c} x={13} y={1} />
      <Finder c={c} x={1} y={13} />
      {[9, 11, 13, 15, 17].map((col) => (
        <rect key={`h${col}`} x={c * col} y={c * 7} width={c * 0.85} height={c * 0.85} rx={c * 0.15} fill={DEEP} />
      ))}
      {[9, 11, 13, 15, 17].map((row) => (
        <rect key={`v${row}`} x={c * 7} y={c * row} width={c * 0.85} height={c * 0.85} rx={c * 0.15} fill={DEEP} />
      ))}
      {DATA.map(([row, col]) => (
        <rect key={`${row}-${col}`} x={c * col} y={c * row} width={c * 0.82} height={c * 0.82} rx={c * 0.15} fill={DEEP} />
      ))}
    </svg>
  );
}
