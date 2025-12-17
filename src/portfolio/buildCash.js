export function buildCash(transactions) {
  const cash = {};

  transactions.forEach(tx => {
    const currency =
      tx.SaldoValuta ||
      tx.Valuta ||
      tx.Currency ||
      "EUR";

    const type =
      tx.Type ||
      tx.Transactie ||
      tx.Omschrijving ||
      "";

    const isCashEvent =
      /storting|deposit|dividend|rente|interest|withdraw|onttrek|fx|valuta|cash|flatex|geld/i.test(
        String(type).toLowerCase()
      );

    if (!isCashEvent) return;

    const rawAmount =
      tx.Bedrag ||
      tx.Amount ||
      tx.Mutatie ||
      tx.Saldo ||
      tx._1 ||
      tx._2;

    if (rawAmount == null) return;

    const amount = Number(
      String(rawAmount)
        .replace(/\./g, "")
        .replace(",", ".")
    );

    if (isNaN(amount)) return;

    if (!cash[currency]) {
      cash[currency] = {
        balance: 0,
        currency: currency
      };
    }

    cash[currency].balance += amount;
  });

  return cash;
}
