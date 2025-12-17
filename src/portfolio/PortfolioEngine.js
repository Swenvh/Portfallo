// src/portfolio/portfolioEngine.js

import { buildPositionLedger } from "./buildPositionLedger";
import { getLivePrices } from "./getLivePrices";
import { addPerformance } from "./addPerformance";
import { buildCash } from "./buildCash";
import { classifyAndMerge } from "../utils/classifyTransactions";

export async function buildPortfolio(transactions = []) {
  /* =========================
     1️⃣ LEDGER (ENIGE WAARHEID)
     ========================= */
  const classifiedTransactions = classifyAndMerge(transactions);
  const ledger = buildPositionLedger(transactions, classifiedTransactions);

  const openBase = ledger.filter(p => p.status === "OPEN");
  const closedPositions = ledger.filter(p => p.status === "CLOSED");

  /* =========================
     2️⃣ OPEN POSITIES MET PRIJZEN
     ========================= */
  const openPriced = await getLivePrices(openBase);
  const openPositions = addPerformance(openPriced);

  /* =========================
     3️⃣ TOTALEN (in EUR)
     ========================= */
  const portfolioValue = openPositions.reduce(
    (sum, p) => sum + Number(p.marketValueEUR || p.marketValue || 0),
    0
  );

  const unrealizedPL = openPositions.reduce(
    (sum, p) => sum + Number(p.profitLossEUR || p.profitLoss || 0),
    0
  );

  const realizedPL = closedPositions.reduce(
    (sum, p) => sum + Number(p.realizedPL || 0),
    0
  );

  /* =========================
     4️⃣ CASH
     ========================= */
  const cashByCurrency = buildCash(transactions);

  return {
    openPositions,
    closedPositions,
    cashByCurrency,

    portfolioValue,
    unrealizedPL,
    realizedPL,
    totalPL: unrealizedPL + realizedPL
  };
}
