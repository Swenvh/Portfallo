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
    (a, b) =>
      new Date(a.Datum || a.date) -
      new Date(b.Datum || b.date)
  );

  const startDate = new Date(sorted[0].Datum || sorted[0].date);
  const now = new Date();

  // Simpele equity curve: start → nu
  const points = [
    {
      date: startDate,
      label: startDate.toLocaleDateString(),
      value: 0,
      percent: 0
    },
    {
      date: now,
      label: "Nu",
      value: portfolioValue,
      percent: 100
    }
  ];

  return points;
}

/* ======================
   COMPONENT
====================== */
export default function PortfolioPerformanceChart({
  transactions = [],
  portfolioValue = 0
}) {
  const [mode, setMode] = useState("value"); // value | percent
  const [range, setRange] = useState("ALL"); // 1M | 6M | YTD | ALL

  const fullData = useMemo(
    () => buildEquitySeries(transactions, portfolioValue),
    [transactions, portfolioValue]
  );

  const filteredData = useMemo(() => {
    if (range === "ALL") return fullData;

    const now = new Date();
    const cutoff = new Date(now);

    if (range === "1M") cutoff.setMonth(now.getMonth() - 1);
    if (range === "6M") cutoff.setMonth(now.getMonth() - 6);
    if (range === "YTD") cutoff.setMonth(0, 1);

    return fullData.filter(d => d.date >= cutoff);
  }, [fullData, range]);

  if (!filteredData.length) {
    return <p className="muted">Geen performance data</p>;
  }

  return (
    <div className="performance-chart-wrapper">
      {/* ===== CONTROLS ===== */}
      <div className="chart-controls">
        <div className="left">
          <button
            className={mode === "value" ? "active" : ""}
            onClick={() => setMode("value")}
          >
            €
          </button>
          <button
            className={mode === "percent" ? "active" : ""}
            onClick={() => setMode("percent")}
          >
            %
          </button>
        </div>

        <div className="right">
          {["1M", "6M", "YTD", "ALL"].map(r => (
            <button
              key={r}
              className={range === r ? "active" : ""}
              onClick={() => setRange(r)}
            >
              {r}
            </button>
          ))}
        </div>
      </div>

      {/* ===== CHART ===== */}
      <ResponsiveContainer width="100%" height={320}>
        <AreaChart data={filteredData}>
          <defs>
            <linearGradient
              id="portfolioGradient"
              x1="0"
              y1="0"
              x2="0"
              y2="1"
            >
              <stop offset="0%" stopColor="#2563eb" stopOpacity={0.4} />
              <stop offset="100%" stopColor="#2563eb" stopOpacity={0} />
            </linearGradient>
          </defs>

          <CartesianGrid strokeDasharray="3 3" />

          <XAxis
            dataKey="label"
            tick={{ fontSize: 12 }}
          />

          <YAxis
            tickFormatter={(v) =>
              mode === "value"
                ? `€ ${Number(v).toLocaleString()}`
                : `${v.toFixed(0)}%`
            }
          />

          <Tooltip
            formatter={(v) =>
              mode === "value"
                ? `€ ${Number(v).toFixed(2)}`
                : `${v.toFixed(2)}%`
            }
          />

          <Area
            type="monotone"
            dataKey={mode === "value" ? "value" : "percent"}
            stroke="#2563eb"
            strokeWidth={3}
            fill="url(#portfolioGradient)"
            dot={false}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
