import React from "react";
import { usePremium } from "../context/PremiumContext";

export default function UpgradePage() {
  const { setShowPaywall } = usePremium();
  return (
    <div className="max-w-4xl mx-auto p-8">
      <div className="bg-white p-8 rounded shadow text-center">
        <h2 className="text-2xl font-bold mb-3">Portfallo Pro</h2>
        <p className="text-gray-600 mb-6">Pro unlocks AI rebalancing, realtime alerts and premium analytics.</p>
        <button className="bg-blue-600 text-white px-6 py-3 rounded-lg" onClick={() => setShowPaywall(true)}>Start gratis proef</button>
      </div>
    </div>
  );
}
