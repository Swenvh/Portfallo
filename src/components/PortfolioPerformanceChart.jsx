import { useState, useMemo } from "react";
import {
  ResponsiveContainer,
  AreaChart,
  LineChart,
  Area,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend
} from "recharts";
import { TrendingUp, TrendingDown, BarChart3, LineChart as LineChartIcon, Activity } from "lucide-react";

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
function CustomTooltip({ active, payload, label, mode, showBenchmark }) {
  if (!active || !payload || !payload.length) return null;

  return (
    <div className="chart-tooltip">
      <p className="tooltip-label">{label}</p>
      {payload.map((entry, index) => {
        if (entry.dataKey === 'value' && mode === 'value') {
          return (
            <p key={index} style={{ color: entry.color }}>
              <span className="tooltip-name">Waarde:</span>
              <span className="tooltip-value">€ {Number(entry.value).toLocaleString('nl-NL', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
            </p>
          );
        }
        if (entry.dataKey === 'percent' && mode === 'percent') {
          return (
            <p key={index} style={{ color: entry.color }}>
              <span className="tooltip-name">Return:</span>
              <span className="tooltip-value">{entry.value.toFixed(2)}%</span>
            </p>
          );
        }
        if (entry.dataKey === 'benchmark' && showBenchmark && mode === 'percent') {
          return (
            <p key={index} style={{ color: entry.color }}>
              <span className="tooltip-name">S&P 500:</span>
              <span className="tooltip-value">{entry.value.toFixed(2)}%</span>
            </p>
          );
        }
        return null;
      })}
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
  const [mode, setMode] = useState("percent");
  const [range, setRange] = useState("ALL");
  const [chartType, setChartType] = useState("area");
  const [showBenchmark, setShowBenchmark] = useState(true);

  const fullData = useMemo(
    () => buildEquitySeries(transactions, portfolioValue),
    [transactions, portfolioValue]
  );

  const filteredData = useMemo(() => {
    if (range === "ALL") return fullData;

    const now = new Date();
    const cutoff = new Date(now);

    if (range === "1W") cutoff.setDate(now.getDate() - 7);
    if (range === "1M") cutoff.setMonth(now.getMonth() - 1);
    if (range === "3M") cutoff.setMonth(now.getMonth() - 3);
    if (range === "6M") cutoff.setMonth(now.getMonth() - 6);
    if (range === "YTD") cutoff.setMonth(0, 1);
    if (range === "1Y") cutoff.setFullYear(now.getFullYear() - 1);

    return fullData.filter(d => d.date >= cutoff);
  }, [fullData, range]);

  const stats = useMemo(() => calculateStats(filteredData), [filteredData]);

  if (!filteredData.length) {
    return <p className="muted">Geen performance data</p>;
  }

  const Chart = chartType === "area" ? AreaChart : LineChart;
  const DataComponent = chartType === "area" ? Area : Line;

  return (
    <div className="performance-chart-wrapper">
      {/* ===== STATS ROW ===== */}
      {stats && (
        <div className="performance-stats">
          <div className="stat-item">
            <span className="stat-label">Total Return</span>
            <span className={`stat-value ${stats.totalReturn >= 0 ? 'positive' : 'negative'}`}>
              {stats.totalReturn >= 0 ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
              {stats.totalReturn.toFixed(2)}%
            </span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Max Drawdown</span>
            <span className="stat-value negative">
              -{stats.maxDrawdown.toFixed(2)}%
            </span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Volatiliteit</span>
            <span className="stat-value neutral">
              {stats.volatility.toFixed(2)}%
            </span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Beste Dag</span>
            <span className="stat-value positive">
              +{stats.bestDay.toFixed(2)}%
            </span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Slechtste Dag</span>
            <span className="stat-value negative">
              {stats.worstDay.toFixed(2)}%
            </span>
          </div>
        </div>
      )}

      {/* ===== CONTROLS ===== */}
      <div className="chart-controls">
        <div className="controls-row">
          <div className="control-group">
            <label className="control-label">Weergave</label>
            <div className="button-group">
              <button
                className={`control-btn ${mode === "value" ? "active" : ""}`}
                onClick={() => setMode("value")}
                title="Absolute waarde"
              >
                <Activity size={14} />
                Waarde
              </button>
              <button
                className={`control-btn ${mode === "percent" ? "active" : ""}`}
                onClick={() => setMode("percent")}
                title="Percentage return"
              >
                <TrendingUp size={14} />
                Return %
              </button>
            </div>
          </div>

          <div className="control-group">
            <label className="control-label">Grafiek Type</label>
            <div className="button-group">
              <button
                className={`control-btn ${chartType === "area" ? "active" : ""}`}
                onClick={() => setChartType("area")}
                title="Area chart"
              >
                <BarChart3 size={14} />
              </button>
              <button
                className={`control-btn ${chartType === "line" ? "active" : ""}`}
                onClick={() => setChartType("line")}
                title="Line chart"
              >
                <LineChartIcon size={14} />
              </button>
            </div>
          </div>

          <div className="control-group">
            <label className="control-label">Benchmark</label>
            <div className="button-group">
              <button
                className={`control-btn ${showBenchmark ? "active" : ""}`}
                onClick={() => setShowBenchmark(!showBenchmark)}
                title="Vergelijk met S&P 500"
              >
                S&P 500
              </button>
            </div>
          </div>
        </div>

        <div className="controls-row">
          <div className="control-group">
            <label className="control-label">Periode</label>
            <div className="button-group">
              {["1W", "1M", "3M", "6M", "YTD", "1Y", "ALL"].map(r => (
                <button
                  key={r}
                  className={`control-btn ${range === r ? "active" : ""}`}
                  onClick={() => setRange(r)}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ===== CHART ===== */}
      <ResponsiveContainer width="100%" height={400}>
        <Chart data={filteredData}>
          <defs>
            <linearGradient id="portfolioGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.5} />
              <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0.05} />
            </linearGradient>
            <linearGradient id="benchmarkGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#64748b" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#64748b" stopOpacity={0.02} />
            </linearGradient>
          </defs>

          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" opacity={0.5} />

          <XAxis
            dataKey="label"
            tick={{ fontSize: 11, fill: '#64748b' }}
            stroke="#cbd5e1"
          />

          <YAxis
            tickFormatter={(v) =>
              mode === "value"
                ? `€${(v / 1000).toFixed(0)}k`
                : `${v.toFixed(0)}%`
            }
            tick={{ fontSize: 11, fill: '#64748b' }}
            stroke="#cbd5e1"
          />

          <Tooltip
            content={<CustomTooltip mode={mode} showBenchmark={showBenchmark} />}
          />

          {mode === 'percent' && showBenchmark && (
            <Legend
              verticalAlign="top"
              height={36}
              iconType="line"
              wrapperStyle={{ paddingBottom: '10px' }}
            />
          )}

          {showBenchmark && mode === 'percent' && (
            <DataComponent
              type="monotone"
              dataKey="benchmark"
              stroke="#64748b"
              strokeWidth={2}
              fill={chartType === "area" ? "url(#benchmarkGradient)" : "none"}
              dot={false}
              name="S&P 500"
              strokeDasharray="5 5"
            />
          )}

          <DataComponent
            type="monotone"
            dataKey={mode === "value" ? "value" : "percent"}
            stroke="#0ea5e9"
            strokeWidth={3}
            fill={chartType === "area" ? "url(#portfolioGradient)" : "none"}
            dot={false}
            name="Portfolio"
            animationDuration={800}
          />
        </Chart>
      </ResponsiveContainer>
    </div>
  );
}
