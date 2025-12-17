export function buildCash(transactions, classifiedTransactions = []) {
  const cash = { EUR: { balance: 0, currency: "EUR" } };

  classifiedTransactions.forEach(ct => {
    if (ct.type === "CASH_TRANSFER" || ct.type === "DIVIDEND") {
      cash.EUR.balance += ct.cashEUR;
    } else if (ct.type === "BUY" || ct.type === "SELL") {
      cash.EUR.balance += ct.cashEUR;
    }
  });

  return cash;
}
