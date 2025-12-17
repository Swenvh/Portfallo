import React from "react";
import { usePremium } from "../context/PremiumContext";
import { Check, Zap, Crown, TrendingUp } from "lucide-react";

export default function TransactionsPage() {
  const { setShowPaywall } = usePremium();

  const plans = [
    {
      name: "Free",
      price: "€0",
      period: "altijd gratis",
      description: "Ideaal om te beginnen met portfolio tracking",
      icon: TrendingUp,
      iconColor: "#64748b",
      features: [
        "Tot 10 posities",
        "Basis portfolio analytics",
        "Performance tracking",
        "CSV import (DeGiro)",
        "Portfolio allocatie chart",
        "Open & gesloten posities",
        "Basis P/L rapportage"
      ],
      cta: "Huidige plan",
      ctaVariant: "outline",
      disabled: true
    },
    {
      name: "Pro",
      price: "€9,99",
      period: "per maand",
      description: "Voor serieuze beleggers die hun portfolio optimaliseren",
      icon: Zap,
      iconColor: "#3b82f6",
      popular: true,
      features: [
        "Onbeperkt aantal posities",
        "AI-powered rebalancing advies",
        "Geavanceerde risico analyse",
        "Real-time koersen & alerts",
        "Tax loss harvesting suggesties",
        "Portfolio stress tests",
        "Advanced performance metrics",
        "Export naar Excel/PDF",
        "Email ondersteuning"
      ],
      cta: "Start gratis proefperiode",
      ctaVariant: "primary",
      onClick: true
    },
    {
      name: "Enterprise",
      price: "€29,99",
      period: "per maand",
      description: "Voor professionele beleggers en vermogensbeheerders",
      icon: Crown,
      iconColor: "#f59e0b",
      features: [
        "Alles van Pro",
        "Meerdere portfolio's beheren",
        "Team collaboration tools",
        "API toegang voor integraties",
        "Custom rapportage & branding",
        "Dedicated account manager",
        "Priority ondersteuning",
        "Geavanceerde tax reporting",
        "White-label optie beschikbaar"
      ],
      cta: "Contact opnemen",
      ctaVariant: "secondary"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-12 md:py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
            Kies het juiste plan voor jou
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Start gratis en upgrade wanneer je meer functionaliteit nodig hebt.
            Alle betaalde plannen hebben een 14 dagen gratis proefperiode.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
          {plans.map((plan, index) => {
            const IconComponent = plan.icon;
            return (
              <div
                key={index}
                className={`pricing-card ${plan.popular ? 'pricing-card-popular' : ''}`}
              >
                {plan.popular && (
                  <div className="pricing-badge">
                    Meest populair
                  </div>
                )}

                <div className="pricing-header">
                  <div
                    className="pricing-icon"
                    style={{ background: `linear-gradient(135deg, ${plan.iconColor}15, ${plan.iconColor}30)` }}
                  >
                    <IconComponent size={32} style={{ color: plan.iconColor }} />
                  </div>
                  <h3 className="pricing-title">{plan.name}</h3>
                  <p className="pricing-description">{plan.description}</p>

                  <div className="pricing-price-section">
                    <div className="pricing-price">{plan.price}</div>
                    <div className="pricing-period">{plan.period}</div>
                  </div>
                </div>

                <div className="pricing-features">
                  {plan.features.map((feature, i) => (
                    <div key={i} className="pricing-feature">
                      <Check size={18} className="pricing-check" />
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>

                <div className="pricing-footer">
                  <button
                    className={`pricing-cta pricing-cta-${plan.ctaVariant} ${plan.disabled ? 'pricing-cta-disabled' : ''}`}
                    onClick={plan.onClick ? () => setShowPaywall(true) : undefined}
                    disabled={plan.disabled}
                  >
                    {plan.cta}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-16 text-center">
          <p className="text-slate-600 mb-4">Heb je vragen over welk plan het beste bij je past?</p>
          <a href="mailto:support@portfallo.com" className="text-blue-600 hover:text-blue-700 font-semibold">
            Neem contact met ons op →
          </a>
        </div>
      </div>
    </div>
  );
}
