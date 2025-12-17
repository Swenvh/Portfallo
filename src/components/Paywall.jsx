// src/components/Paywall.jsx
import { X } from "lucide-react";
import { usePremium } from "../context/PremiumContext";

export default function Paywall() {
  const { setShowPaywall } = usePremium();

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50"
         onClick={() => setShowPaywall(false)}>

      <div
        className="bg-white w-[90%] max-w-lg rounded-xl shadow-xl p-8 relative"
        onClick={(e) => e.stopPropagation()} // voorkomt sluiten bij klikken op de box
      >
        {/* Close button */}
        <button
          className="absolute right-4 top-4 text-gray-400 hover:text-gray-600"
          onClick={() => setShowPaywall(false)}
        >
          <X size={24} />
        </button>

        {/* Icon */}
        <div className="flex justify-center mb-4">
          <div className="bg-amber-100 w-16 h-16 rounded-full flex items-center justify-center">
            <X size={32} className="text-amber-600" />
          </div>
        </div>

        <h2 className="text-2xl font-bold text-center">Ontgrendel Portfallo Pro</h2>
        <p className="text-center text-gray-500 mt-2">
          Krijg toegang tot AI-optimalisatie, geavanceerde risico-analyses en premium alerts.
        </p>

        {/* Features */}
        <ul className="mt-6 space-y-3 text-gray-700">
          <li>✔ AI-gestuurde transactieadviezen</li>
          <li>✔ Real-time risico & kosten alerts</li>
          <li>✔ Diepe sector- en valuta-analyses</li>
          <li>✔ Onbeperkte portfolio imports</li>
        </ul>

        {/* CTA button */}
        <button
          className="mt-8 w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg"
          onClick={() => alert("Pro upgrade flow komt hier!")}
        >
          Start Pro (7 dagen gratis proef)
        </button>
      </div>
    </div>
  );
}
