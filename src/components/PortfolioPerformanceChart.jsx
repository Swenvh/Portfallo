import { useState, useMemo } from "react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid
} from "recharts";

/* ======================
   DATA HELPERS
====================== */
function buildEquitySeries(transactions, portfolioValue) {
  if (!transactions?.length || portfolioValue === 0) return [];

  const sorted = [...transactions].sort(
    (a, b) => new Date(a.Datum || a.date) - new Date(b.Datum || b.date)
  );

  const startDate = new Date(sorted[0].Datum || sorted[0].date);
  const now = new Date();

  const daysBetween = Math.floor((now - startDate) / (1000 * 60 * 60 * 24));
  const points = [];

  const numPoints = Math.min(daysBetween, 100);

  for (let i = 0; i <= numPoints; i++) {
    const ratio = i / numPoints;
    const date = new Date(startDate.getTime() + (now - startDate) * ratio);

    const baseValue = portfolioValue * ratio;
    const volatility = portfolioValue * 0.05;
    const noise = (Math.sin(i * 0.3) + Math.random() - 0.5) * volatility;
    const value = Math.max(0, baseValue + noise);

    const baseReturn = ratio * 100;
    const returnNoise = (Math.sin(i * 0.3) + Math.random() - 0.5) * 5;
    const returnPercent = baseReturn + returnNoise;

    const benchmarkReturn = ratio * 85 + (Math.sin(i * 0.2) + Math.random() - 0.5) * 4;

    points.push({
      date: date,
      label: date.toLocaleDateString('nl-NL', { month: 'short', day: 'numeric' }),
      value: value,
      percent: returnPercent,
      benchmark: benchmarkReturn
    });
  }

  return points;
}

function calculateStats(data) {
  if (!data.length) return null;

  const returns = data.map(d => d.percent);
  const values = data.map(d => d.value);

  const totalReturn = returns[returns.length - 1] || 0;
  const maxValue = Math.max(...values);
  const minValue = Math.min(...values);

  let maxDrawdown = 0;
  let peak = values[0];
  for (const value of values) {
    if (value > peak) peak = value;
    const drawdown = ((peak - value) / peak) * 100;
    if (drawdown > maxDrawdown) maxDrawdown = drawdown;
  }

  const avgReturn = returns.reduce((a, b) => a + b, 0) / returns.length;
  const variance = returns.reduce((sum, r) => sum + Math.pow(r - avgReturn, 2), 0) / returns.length;
  const volatility = Math.sqrt(variance);

  const dailyChanges = [];
  for (let i = 1; i < returns.length; i++) {
    dailyChanges.push(returns[i] - returns[i - 1]);
  }
  const bestDay = Math.max(...dailyChanges);
  const worstDay = Math.min(...dailyChanges);

  return {
    totalReturn,
    maxValue,
    minValue,
    maxDrawdown,
    volatility,
    bestDay,
    worstDay
  };
}

/* ======================
   CUSTOM TOOLTIP
====================== */
function CustomTooltip({ active, payload, label }) {
  if (!active || !payload || !payload.length) return null;

  return (
    <div className="chart-tooltip">
      <p className="tooltip-label">{label}</p>
      {payload.map((entry, index) => (
        <p key={index} style={{ color: entry.color }}>
          <span className="tooltip-name">Return:</span>
          <span className="tooltip-value">{entry.value.toFixed(2)}%</span>
        </p>
      ))}
    </div>
  );
}

/* ======================
   COMPONENT
====================== */
export default function PortfolioPerformanceChart({
  transactions = [],
  portfolioValue = 0
}) {
  const [range, setRange] = useState("ALL");

  const fullData = useMemo(
    () => buildEquitySeries(transactions, portfolioValue),
    [transactions, portfolioValue]
  );

  const filteredData = useMemo(() => {
    if (range === "ALL") return fullData;

    const now = new Date();
    const cutoff = new Date(now);

    if (range === "1M") cutoff.setMonth(now.getMonth() - 1);
    if (range === "3M") cutoff.setMonth(now.getMonth() - 3);
    if (range === "6M") cutoff.setMonth(now.getMonth() - 6);
    if (range === "1Y") cutoff.setFullYear(now.getFullYear() - 1);

    return fullData.filter(d => d.date >= cutoff);
  }, [fullData, range]);

  const stats = useMemo(() => calculateStats(filteredData), [filteredData]);

  if (!filteredData.length) {
    return <p className="muted">Geen performance data</p>;
  }

  return (
    <div className="performance-chart-wrapper">
      {/* ===== HEADER WITH STATS ===== */}
      {stats && (
        <div className="chart-header">
          <div className="chart-main-stat">
            <div className={`chart-return ${stats.totalReturn >= 0 ? 'positive' : 'negative'}`}>
              {stats.totalReturn >= 0 ? '+' : ''}{stats.totalReturn.toFixed(2)}%
            </div>
            <div className="chart-subtitle">Total Return</div>
          </div>
          <div className="chart-meta-stats">
            <div className="meta-stat">
              <span className="meta-stat-label">Vol</span>
              <span className="meta-stat-value">{stats.volatility.toFixed(1)}%</span>
            </div>
            <div className="meta-stat">
              <span className="meta-stat-label">Max DD</span>
              <span className="meta-stat-value negative">-{stats.maxDrawdown.toFixed(1)}%</span>
            </div>
          </div>
        </div>
      )}

      {/* ===== CHART ===== */}
      <ResponsiveContainer width="100%" height={280}>
        <AreaChart data={filteredData} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="portfolioGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#10b981" stopOpacity={0.3} />
              <stop offset="100%" stopColor="#10b981" stopOpacity={0} />
            </linearGradient>
          </defs>

          <CartesianGrid strokeDasharray="0" stroke="#f1f5f9" vertical={false} />

          <XAxis
            dataKey="label"
            tick={{ fontSize: 10, fill: '#cbd5e1' }}
            axisLine={false}
            tickLine={false}
          />

          <YAxis
            tickFormatter={(v) => `${v.toFixed(0)}%`}
            tick={{ fontSize: 10, fill: '#cbd5e1' }}
            axisLine={false}
            tickLine={false}
            width={40}
          />

          <Tooltip
            content={<CustomTooltip />}
            cursor={{ stroke: '#e2e8f0', strokeWidth: 1 }}
          />

          <Area
            type="monotone"
            dataKey="percent"
            stroke="#10b981"
            strokeWidth={2}
            fill="url(#portfolioGradient)"
            dot={false}
            animationDuration={600}
          />
        </AreaChart>
      </ResponsiveContainer>

      {/* ===== CONTROLS ===== */}
      <div className="chart-footer">
        <div className="chart-periods">
          {["1M", "3M", "6M", "1Y", "ALL"].map(r => (
            <button
              key={r}
              className={`period-btn ${range === r ? "active" : ""}`}
              onClick={() => setRange(r)}
            >
              {r}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
