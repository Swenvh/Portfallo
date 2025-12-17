import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend
} from "recharts";
import { toTradingViewSymbol } from "../utils/tradingViewSymbol";

const COLORS = [
  "#0ea5e9",
  "#2563eb",
  "#16a34a",
  "#22c55e",
  "#f59e0b",
  "#ef4444",
  "#8b5cf6",
  "#ec4899"
];

const CASH_COLOR = "#64748b";
const MAX_SLICES = 7;

export default function PortfolioAllocationChart({
  positions = [],
  cash = 0
}) {
  /* ======================
     DATA NORMALISATIE
  ====================== */
  const assetData = positions
    .map(p => {
      const value =
        Number(p.marketValue) ||
        (p.avgPrice && p.quantity
          ? Math.abs(p.avgPrice * p.quantity)
          : 0);

      return {
        name: toTradingViewSymbol(p.symbol || p.asset || "Onbekend"),
        value,
        type: "asset"
      };
    })
    .filter(d => d.value > 0)
    .sort((a, b) => b.value - a.value);

  /* ======================
     TOP N + OVERIG
  ====================== */
  const mainAssets = assetData.slice(0, MAX_SLICES);
  const restAssets = assetData.slice(MAX_SLICES);

  const restValue = restAssets.reduce(
    (sum, a) => sum + a.value,
    0
  );

  const data = [
    ...mainAssets,
    ...(restValue > 0
      ? [{ name: "Overig", value: restValue, type: "other" }]
      : []),
    ...(cash > 0
      ? [{ name: "Cash", value: cash, type: "cash" }]
      : [])
  ];

  const totalValue = data.reduce(
    (sum, d) => sum + d.value,
    0
  );

  if (data.length === 0) {
    return <p className="muted">Geen data voor grafiek</p>;
  }

  /* ======================
     TOOLTIP
  ====================== */
  const tooltipFormatter = (value, name) => {
    const percent =
      totalValue > 0
        ? (value / totalValue) * 100
        : 0;

    return [
      `€ ${Number(value).toFixed(2)} (${percent.toFixed(1)}%)`,
      name
    ];
  };

  const CustomTooltip = ({ active, payload }) => {
    if (!active || !payload || !payload.length) return null;

    const data = payload[0];
    const percent = totalValue > 0 ? (data.value / totalValue) * 100 : 0;

    return (
      <div className="allocation-tooltip">
        <div className="tooltip-header">
          <span className="tooltip-dot" style={{ background: data.payload.fill }} />
          <span className="tooltip-name">{data.name}</span>
        </div>
        <div className="tooltip-value">€ {Number(data.value).toLocaleString('nl-NL', {minimumFractionDigits: 2, maximumFractionDigits: 2})}</div>
        <div className="tooltip-percent">{percent.toFixed(1)}% van portfolio</div>
      </div>
    );
  };

  return (
    <div className="allocation-wrapper">
      <div className="allocation-chart-container">
        <ResponsiveContainer width="100%" height={380}>
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              innerRadius="65%"
              outerRadius="85%"
              paddingAngle={3}
              stroke="none"
            >
              {data.map((entry, index) => {
                let fill = COLORS[index % COLORS.length];

                if (entry.type === "cash") fill = CASH_COLOR;
                if (entry.type === "other") fill = "#94a3b8";

                return <Cell key={index} fill={fill} />;
              })}
            </Pie>

            <Tooltip content={<CustomTooltip />} />
          </PieChart>
        </ResponsiveContainer>

        <div className="allocation-center">
          <span className="center-label">Totale waarde</span>
          <strong className="center-value">€ {totalValue.toLocaleString('nl-NL', {minimumFractionDigits: 2, maximumFractionDigits: 2})}</strong>
          <span className="center-sub">{positions.length + (cash > 0 ? 1 : 0)} assets</span>
        </div>
      </div>

      <div className="allocation-legend">
        {data.map((d, i) => {
          const percent =
            totalValue > 0
              ? (d.value / totalValue) * 100
              : 0;

          let color = COLORS[i % COLORS.length];
          if (d.type === "cash") color = CASH_COLOR;
          if (d.type === "other") color = "#94a3b8";

          return (
            <div key={i} className="legend-item">
              <div className="legend-left">
                <span
                  className="legend-dot"
                  style={{ background: color }}
                />
                <span className="legend-name">{d.name}</span>
              </div>
              <div className="legend-right">
                <span className="legend-percent">{percent.toFixed(1)}%</span>
                <span className="legend-value">€ {d.value.toLocaleString('nl-NL', {minimumFractionDigits: 2, maximumFractionDigits: 2})}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
