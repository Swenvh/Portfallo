import { Link } from "react-router-dom";
import PageContainer from "../components/PageContainer";

export default function HomePage() {
  return (
    <PageContainer>
      <h1>Welkom bij Portfallo</h1>
      <p className="subtitle">
        Upload je transacties en krijg direct inzicht in je portefeuille.
      </p>

      <div className="card-grid">
        <Link to="/upload" className="action-card">
          📂 Upload data
        </Link>

        <Link to="/dashboard" className="action-card">
          📊 Dashboard
        </Link>

        <div className="action-card disabled">
          🤖 AI-advies (PRO)
        </div>
      </div>
    </PageContainer>
  );
}
