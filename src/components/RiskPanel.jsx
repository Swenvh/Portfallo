// src/components/RiskPanel.jsx
import React from "react";

export default function RiskPanel({ meta = {}, flags = {} }) {
  // meta: { totalValue, bySector, byCurrency }
  const totalValue = (meta && meta.totalValue) ? meta.totalValue : 0;
  const sectors = meta && meta.bySector ? meta.bySector : {};
  const currencies = meta && meta.byCurrency ? meta.byCurrency : {};

  return (
    <div className="bg-white rounded-xl shadow p-4">
      <h4 className="text-lg font-semibold mb-3">Risico overzicht</h4>

      <div className="text-sm text-gray-600 mb-3">
        <div className="flex justify-between"><span>Totaalwaarde</span><strong>€ {Number(totalValue || 0).toFixed(2)}</strong></div>
      </div>

      <div className="mb-3">
        <h5 className="font-medium text-sm text-gray-700 mb-2">Top sectoren</h5>
        <ul className="text-sm text-gray-600 space-y-1">
          {Object.entries(sectors).length === 0 && <li>Geen data</li>}
          {Object.entries(sectors).slice(0,5).map(([k,v]) => (
            <li key={k} className="flex justify-between">
              <span>{k}</span>
              <span>{totalValue ? `${((v/totalValue)*100).toFixed(1)}%` : "-"}</span>
            </li>
          ))}
        </ul>
      </div>

      <div>
        <h5 className="font-medium text-sm text-gray-700 mb-2">Valuta exposure</h5>
        <ul className="text-sm text-gray-600 space-y-1">
          {Object.keys(currencies).length === 0 ? <li>Geen data</li> : (
            Object.entries(currencies).map(([k,v]) => (
              <li key={k} className="flex justify-between">
                <span>{k}</span>
                <span>{totalValue ? `${((v/totalValue)*100).toFixed(1)}%` : "-"}</span>
              </li>
            ))
          )}
        </ul>
      </div>
    </div>
  );
}
