const USD_TO_EUR_RATE = 0.93;

export function convertToEUR(amount, currency) {
  if (!currency || currency === 'EUR') {
    return Number(amount);
  }

  if (currency === 'USD') {
    return Number(amount) * USD_TO_EUR_RATE;
  }

  return Number(amount);
}

export function formatCurrency(amount, currency = 'EUR') {
  const symbol = currency === 'USD' ? '$' : '€';
  return `${symbol} ${Number(amount).toLocaleString('nl-NL', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  })}`;
}
