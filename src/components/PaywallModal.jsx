// src/components/PaywallModal.jsx
import React from "react";
import { X } from "lucide-react";
import { usePremium } from "../context/PremiumContext";

export default function PaywallModal() {
  const premium = usePremium();

  // 🛡️ Veiligheid: context bestaat niet
  if (!premium) return null;

  const {
    showPaywall,
    setShowPaywall,
    setIsPremium,
    isPremium,
  } = premium;

  // Niet renderen als hij dicht is
  if (!showPaywall) return null;

  const close = () => setShowPaywall(false);

  return (
    <div
      className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50"
      onClick={close}
    >
      <div
        className="bg-white w-[90%] max-w-lg rounded-2xl shadow-2xl p-8 relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close */}
        <button
          className="absolute right-4 top-4 text-gray-500 hover:text-gray-700"
          onClick={close}
        >
          <X size={22} />
        </button>

        {/* Header */}
        <div className="text-center mb-6">
          <div className="mx-auto bg-amber-100 w-16 h-16 rounded-full flex items-center justify-center mb-3">
            ⭐
          </div>
          <h2 className="text-2xl font-bold">Ontgrendel Portfallo Pro</h2>
          <p className="text-gray-600 mt-2">
            AI-rebalancing, realtime alerts en diepgaande analyses.
          </p>
        </div>

        {/* Features */}
        <ul className="text-sm text-gray-700 space-y-2 mb-6">
          <li>✓ AI-gestuurde transactieadviezen</li>
          <li>✓ Realtime risico- & kostenalerts</li>
          <li>✓ Diepe sector- & valuta-analyses</li>
          <li>✓ Onbeperkte portfolio-imports</li>
        </ul>

        {/* Actions */}
        <div className="flex gap-3">
          <button
            className="flex-1 bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700"
            onClick={() => {
              alert("Mock checkout");
              setIsPremium(true);
              close();
            }}
          >
            Start Pro (7 dagen gratis)
          </button>

          <button
            className="flex-1 bg-gray-100 py-3 rounded-lg hover:bg-gray-200"
            onClick={close}
          >
            Sluiten
          </button>
        </div>
      </div>
    </div>
  );
}
