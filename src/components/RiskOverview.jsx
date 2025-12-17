// src/components/RiskOverview.jsx
import React from "react";
import { usePortfolio } from "../context/PortfolioContext";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

function SmallStat({ label, value }) {
  return (
    <div className="bg-white p-3 rounded shadow-sm text-center">
      <div className="text-xs text-gray-500">{label}</div>
      <div className="text-lg font-bold">{value}</div>
    </div>
  );
}

export default function RiskOverview() {
  const { risk, totalValue } = usePortfolio();
  if (!risk) return null;

  const { currencyExposure, sectorExposure, countryExposure, concentration, riskScore, warnings } = risk;

  // convert sectorExposure map to chart array
  const sectorData = Object.entries(sectorExposure).map(([k, v]) => ({ name: k, value: Number(v.toFixed(2)) }));
  const currencyData = Object.entries(currencyExposure).map(([k, v]) => ({ name: k, value: Number(v.toFixed(2)) }));

  return (
    <div className="bg-white rounded-xl p-6 shadow">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-xl font-bold">Risico & Allocatie</h3>
          <p className="text-sm text-gray-500">Snapshot van concentratie, valuta- en sector-exposure</p>
        </div>
        <div className="text-right">
          <div className="text-xs text-gray-500">Risicoscore</div>
          <div className={`text-2xl font-extrabold ${riskScore.score >= 70 ? 'text-red-600' : riskScore.score >= 50 ? 'text-amber-500' : 'text-green-600'}`}>
            {riskScore.score}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3 mb-4">
        <SmallStat label="Totaalwaarde" value={`€ ${Number(totalValue + (risk?.positionsValueMap ? 0 : 0)).toFixed(2)}`} />
        <SmallStat label="Top positie" value={`${concentration.topAsset || '—'} (${Math.round(concentration.topShare * 100)}%)`} />
        <SmallStat label="Concentratie index" value={concentration.concentrationIndex ?? concentration.concentrationIndex } />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div>
          <h4 className="font-semibold mb-2">Sector exposure</h4>
          {sectorData.length === 0 ? <p className="text-sm text-gray-500">Geen posities</p> : (
            <div style={{ width: '100%', height: 140 }}>
              <ResponsiveContainer>
                <BarChart data={sectorData}>
                  <XAxis dataKey="name" hide />
                  <YAxis hide />
                  <Tooltip formatter={(val) => `${Number(val).toFixed(2)} EUR`} />
                  <Bar dataKey="value" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
          <ul className="text-sm mt-2">
            {Object.entries(sectorExposure).map(([k, v]) => <li key={k} className="flex justify-between"><span>{k}</span><span>€{Number(v).toFixed(2)}</span></li>)}
          </ul>
        </div>

        <div>
          <h4 className="font-semibold mb-2">Valuta exposure</h4>
          {currencyData.length === 0 ? <p className="text-sm text-gray-500">Geen posities</p> : (
            <>
              <div style={{ width: '100%', height: 140 }}>
                <ResponsiveContainer>
                  <BarChart data={currencyData}>
                    <XAxis dataKey="name" hide />
                    <YAxis hide />
                    <Tooltip formatter={(val) => `${Number(val).toFixed(2)} EUR`} />
                    <Bar dataKey="value" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <ul className="text-sm mt-2">
                {Object.entries(currencyExposure).map(([k, v]) => <li key={k} className="flex justify-between"><span>{k}</span><span>€{Number(v).toFixed(2)}</span></li>)}
              </ul>
            </>
          )}
        </div>
      </div>

      <div className="mt-4">
        <h4 className="font-semibold mb-2">Waarschuwingen</h4>
        {warnings.length === 0 ? <p className="text-sm text-gray-500">Geen waarschuwingen</p> : (
          <ul className="space-y-2">
            {warnings.map((w, i) => (
              <li key={i} className={`p-3 rounded ${w.level === 'high' ? 'bg-red-50 border border-red-200' : 'bg-amber-50 border border-amber-200'}`}>
                <div className="text-sm font-semibold">{w.text}</div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
