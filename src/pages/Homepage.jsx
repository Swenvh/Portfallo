import { Link } from "react-router-dom";
import { TrendingUp, Upload, BarChart3, Shield, Zap, Target, Eye } from "lucide-react";

export default function HomePage() {
  return (
    <div className="home-page">
      <section className="hero-section">
        <div className="hero-content">
          <div className="hero-badge">
            <Zap size={16} />
            <span>Portfolio Management Platform</span>
          </div>

          <h1 className="hero-title">
            Beheer je portfolio
            <span className="gradient-text"> slim & overzichtelijk</span>
          </h1>

          <p className="hero-subtitle">
            Analyseer je beleggingen, track performance in real-time en krijg waardevolle inzichten
            om betere beslissingen te maken. Alles wat je nodig hebt op één plek.
          </p>

          <div className="hero-cta">
            <Link to="/upload" className="btn-hero-primary">
              <Upload size={20} />
              Start met uploaden
            </Link>
            <Link to="/demo" className="btn-hero-secondary">
              <Eye size={20} />
              Bekijk demo
            </Link>
          </div>

          <div className="hero-stats">
            <div className="stat-item">
              <TrendingUp size={24} />
              <div>
                <div className="stat-value">Real-time</div>
                <div className="stat-label">Koersen</div>
              </div>
            </div>
            <div className="stat-item">
              <Shield size={24} />
              <div>
                <div className="stat-value">100%</div>
                <div className="stat-label">Privacy</div>
              </div>
            </div>
            <div className="stat-item">
              <Target size={24} />
              <div>
                <div className="stat-value">Instant</div>
                <div className="stat-label">Analyse</div>
              </div>
            </div>
          </div>
        </div>

        <div className="hero-visual">
          <div className="visual-card card-1">
            <div className="mini-chart">
              <div className="chart-bar" style={{height: '40%'}}></div>
              <div className="chart-bar" style={{height: '65%'}}></div>
              <div className="chart-bar" style={{height: '45%'}}></div>
              <div className="chart-bar" style={{height: '80%'}}></div>
              <div className="chart-bar" style={{height: '60%'}}></div>
              <div className="chart-bar" style={{height: '95%'}}></div>
            </div>
            <div className="card-label">
              <TrendingUp size={16} />
              <span>+24.5%</span>
            </div>
          </div>

          <div className="visual-card card-2">
            <div className="donut-mini"></div>
            <div className="card-label">Portfolio Mix</div>
          </div>

          <div className="visual-card card-3">
            <div className="value-display">€ 45,250</div>
            <div className="card-label">Totale waarde</div>
          </div>
        </div>
      </section>

      <section className="features-section">
        <div className="section-header">
          <h2>Alles wat je nodig hebt</h2>
          <p>Krachtige tools voor slimmer beleggen</p>
        </div>

        <div className="features-grid">
          <Link to="/demo" className="feature-card">
            <div className="feature-icon blue">
              <Eye size={24} />
            </div>
            <h3>Demo Dashboard</h3>
            <p>Probeer Portfallo uit met voorbeeld data en zie alle features in actie voordat je start.</p>
            <div className="feature-arrow">→</div>
          </Link>

          <Link to="/upload" className="feature-card">
            <div className="feature-icon green">
              <Upload size={24} />
            </div>
            <h3>Upload & Analyse</h3>
            <p>Importeer je transactiedata en krijg direct diepgaand inzicht in je portfolio performance.</p>
            <div className="feature-arrow">→</div>
          </Link>

          <div className="feature-card pro-card">
            <div className="feature-icon gold">
              <Target size={24} />
            </div>
            <h3>AI Advies</h3>
            <p>Slimme aanbevelingen, risk analysis en portfolio optimalisatie op basis van je doelen.</p>
            <div className="pro-badge-inline">PRO</div>
          </div>
        </div>
      </section>
    </div>
  );
}
