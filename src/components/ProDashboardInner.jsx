// src/components/ProDashboardInner.jsx
import React from "react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import { usePortfolio } from "../context/PortfolioContext";
import RiskPanel from "./RiskPanel";
import AIAdvicePanel from "./AIAdvicePanel";

const COLORS = [
  "#3b82f6","#10b981","#f59e0b","#ef4444","#8b5cf6","#14b8a6","#f97316","#22c55e"
];

export default function ProDashboardInner() {
  const { holdings } = usePortfolio();

  const sectorStats = React.useMemo(() => {
    if (!holdings || holdings.length === 0) return [];
    const map = {};
    holdings.forEach(h => {
      const s = h.sector || "Onbekend";
      map[s] = (map[s] || 0) + (Number(h.value)||0);
    });
    const total = holdings.reduce((s,h)=>s+(Number(h.value)||0),0);
    return Object.entries(map).map(([name, amount], i) => ({
      name,
      value: total ? (amount/total)*100 : 0,
      color: COLORS[i % COLORS.length]
    }));
  }, [holdings]);

  return (
    <div className="grid lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2 space-y-6">
        <div className="bg-gray-900 text-white p-6 rounded-2xl shadow-xl">
          <h3 className="text-2xl font-bold mb-4">Portfolio Analyse</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="h-64 bg-gray-800 rounded p-2">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={sectorStats} dataKey="value" nameKey="name" innerRadius={60} outerRadius={90}>
                    {sectorStats.map((s,i)=>(<Cell key={i} fill={s.color} />))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="bg-gray-800 rounded p-4">
              <h4 className="font-semibold text-white mb-3">Sector Overzicht</h4>
              <div className="space-y-2 text-sm text-gray-200">
                {sectorStats.map((s,i)=>(
                  <div key={i} className="flex justify-between">
                    <div className="flex items-center gap-2"><span className="w-2 h-2 rounded-full" style={{background:s.color}}></span>{s.name}</div>
                    <div>{s.value.toFixed(2)}%</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Holdings table kept outside — already present in DashboardPage */}
      </div>

      <div className="space-y-6">
        <RiskPanel />
        <AIAdvicePanel />
      </div>
    </div>
  );
}
