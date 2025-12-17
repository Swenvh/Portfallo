import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer
} from "recharts";

/* 🎨 SaaS-waardige kleuren */
const COLORS = [
  "#2563eb",
  "#0ea5e9",
  "#16a34a",
  "#22c55e",
  "#f59e0b",
  "#dc2626",
  "#7c3aed"
];

const CASH_COLOR = "#64748b";
const MAX_SLICES = 6; // 👈 top 6 + overig

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
        name: p.symbol || p.asset || "Onbekend",
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

  /* ======================
     RENDER
  ====================== */
  return (
    <div className="allocation-wrapper">
      {/* ===== DONUT ===== */}
      <div className="allocation-chart">
        <ResponsiveContainer width="100%" height={340}>
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              innerRadius={95}
              outerRadius={140}
              paddingAngle={2}
              stroke="none"
            >
              {data.map((entry, index) => {
                let fill = COLORS[index % COLORS.length];

                if (entry.type === "cash") fill = CASH_COLOR;
                if (entry.type === "other") fill = "#94a3b8";

                return <Cell key={index} fill={fill} />;
              })}
            </Pie>

            <Tooltip formatter={tooltipFormatter} />
          </PieChart>
        </ResponsiveContainer>

        {/* ===== CENTER KPI ===== */}
        <div className="allocation-center">
          <span className="label">Totale waarde</span>
          <strong>€ {totalValue.toFixed(2)}</strong>
          <span className="sub">
            {positions.length} assets
          </span>
        </div>
      </div>

      {/* ===== LEGEND ===== */}
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
            <div key={i} className="legend-row">
              <span
                className="dot"
                style={{ background: color }}
              />

              <span className="name">{d.name}</span>

              <span className="percent">
                {percent.toFixed(1)}%
              </span>

              <span className="value">
                € {d.value.toFixed(2)}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
