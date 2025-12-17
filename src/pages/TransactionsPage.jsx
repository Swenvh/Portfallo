import PageContainer from "../components/PageContainer";
import { usePortfolio } from "../context/PortfolioContext";

export default function TransactionsPage() {
  const { transactions, loading } = usePortfolio();

  return (
    <PageContainer>
      <h2>Transacties</h2>
      <p className="subtitle">
        Overzicht van alle geüploade transacties
      </p>

      {loading && <p className="muted">⏳ Transacties laden…</p>}

      {!loading && transactions.length === 0 && (
        <p className="muted">Nog geen transacties beschikbaar.</p>
      )}

      {!loading && transactions.length > 0 && (
        <div className="dashboard-table">
          <table>
            <thead>
              <tr>
                <th>Datum</th>
                <th>Product</th>
                <th>Omschrijving</th>
                <th className="right">Aantal</th>
                <th className="right">Bedrag</th>
                <th>Valuta</th>
              </tr>
            </thead>

            <tbody>
              {transactions.map((t, i) => (
                <tr key={i}>
                  <td>{t.Datum || "—"}</td>
                  <td>{t.Product || "—"}</td>
                  <td className="muted">
                    {t.Omschrijving || "—"}
                  </td>
                  <td className="right">
                    {t.Aantal || "—"}
                  </td>
                  <td className="right">
                    {t._1 || "—"}
                  </td>
                  <td>{t.Saldo || "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </PageContainer>
  );
}
