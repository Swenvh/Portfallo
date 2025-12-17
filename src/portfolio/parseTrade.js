export function parseTrade(omschrijving) {
  if (!omschrijving) return null

  const match = omschrijving.match(
    /(Koop|Verkoop)\s+(\d+)\s+@\s+([\d,.]+)/
  )

  if (!match) return null

  const side = match[1]
  const quantity = Number(match[2]) * (side === 'Verkoop' ? -1 : 1)
  const price = Number(match[3].replace(',', '.'))

  return {
    quantity,
    price
  }
}
