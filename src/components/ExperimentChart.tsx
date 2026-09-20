import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export interface ChartPoint {
  [key: string]: number | string;
}

interface Props {
  data: ChartPoint[];
  xKey: string;
  yKeys: string[];
  /** Accessible summary read by screen readers; the chart itself is decorative. */
  caption: string;
}

const COLORS = ['#1f5f4d', '#8a5a1f', '#8a2f2f', '#4b5058'];

export default function ExperimentChart({ data, xKey, yKeys, caption }: Props) {
  return (
    <figure>
      <div style={{ width: '100%', height: 320 }} role="img" aria-label={caption}>
        <ResponsiveContainer>
          <LineChart data={data} margin={{ top: 8, right: 16, bottom: 8, left: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
            <XAxis dataKey={xKey} stroke="var(--color-ink-muted)" fontSize={12} />
            <YAxis stroke="var(--color-ink-muted)" fontSize={12} />
            <Tooltip />
            {yKeys.map((key, i) => (
              <Line key={key} type="monotone" dataKey={key} stroke={COLORS[i % COLORS.length]} strokeWidth={2} dot={false} />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>
      <figcaption className="mt-2 text-sm text-ink-muted dark:text-ink-muted-dark">{caption}</figcaption>
    </figure>
  );
}
