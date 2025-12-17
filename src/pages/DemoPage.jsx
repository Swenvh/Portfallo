import { useState } from "react";
import { Link } from "react-router-dom";
import { Wallet, TrendingUp, Banknote, PieChart, Eye, ArrowRight, Lock, UserPlus, LineChart, BarChart3 } from "lucide-react";
import PageContainer from "../components/PageContainer";
import StockLogo from "../components/StockLogo";
import { demoPortfolioData } from "../data/demoData";
import { LineChart as RechartsLineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart as RechartsPieChart, Pie, Cell, Area, AreaChart, CartesianGrid } from "recharts";

function formatMoney(value, currency = "USD") {
  const symbol = currency === "USD" ? "$" : "€";
  return `${symbol}${Number(value || 0).toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})}`;
}

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#06b6d4', '#84cc16'];

function LockedActionPrompt({ title, message }) {
  return (
    <div style={{
      background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.05) 0%, rgba(59, 130, 246, 0.02) 100%)',
      border: '2px dashed rgba(59, 130, 246, 0.3)',
      borderRadius: '16px',
      padding: '2rem',
      textAlign: 'center',
      margin: '1rem 0'
    }}>
      <div style={{
        width: '64px',
        height: '64px',
        margin: '0 auto 1rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.15) 0%, rgba(59, 130, 246, 0.08) 100%)',
        borderRadius: '50%',
        color: '#3b82f6'
      }}>
        <Lock size={32} />
      </div>
      <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#1e293b', marginBottom: '0.5rem' }}>
        {title}
      </h3>
      <p style={{ fontSize: '0.9375rem', color: '#64748b', marginBottom: '1.5rem', lineHeight: 1.6 }}>
        {message}
      </p>
      <Link
        to="/register"
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.75rem',
          background: 'linear-gradient(135deg, #3b82f6, #2563eb)',
          color: 'white',
          padding: '0.875rem 1.75rem',
          borderRadius: '12px',
          fontWeight: 700,
          fontSize: '0.9375rem',
          textDecoration: 'none',
          transition: 'all 0.3s ease',
          boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'translateY(-2px)';
          e.currentTarget.style.boxShadow = '0 6px 20px rgba(59, 130, 246, 0.4)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.boxShadow = '0 4px 12px rgba(59, 130, 246, 0.3)';
        }}
      >
        <UserPlus size={20} />
        Maak gratis account aan
      </Link>
    </div>
  );
}

export default function DemoPage() {
  const [showClosedPositions, setShowClosedPositions] = useState(false);
  const { positions, closedPositions, performanceData, summary } = demoPortfolioData;

  const allocationData = positions.map((pos, idx) => ({
    name: pos.symbol,
    value: pos.currentValue,
    percent: pos.weight,
    color: COLORS[idx % COLORS.length]
  }));

  return (
    <PageContainer>
      <div className="dashboard-header" style={{ position: 'relative' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.5rem' }}>
            <h2>Demo Dashboard</h2>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.15) 0%, rgba(245, 158, 11, 0.1) 100%)',
              border: '1px solid rgba(245, 158, 11, 0.3)',
              color: '#d97706',
              padding: '0.375rem 0.875rem',
              borderRadius: '50px',
              fontSize: '0.8125rem',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.05em'
            }}>
              <Eye size={14} />
              Demo modus
            </div>
          </div>
          <p className="subtitle">Voorbeeld portfolio met demo data - Maak een account aan om te beginnen</p>
        </div>
      </div>

      <div className="dashboard-summary">
        <div className="summary-card-v2 card-primary">
          <div className="card-icon blue-gradient">
            <Wallet size={24} />
          </div>
          <div className="card-content">
            <span className="card-label">Totale waarde</span>
            <strong className="card-value">{formatMoney(summary.totalValue)}</strong>
            <small className="card-meta">Inclusief cash</small>
          </div>
        </div>

        <div className="summary-card-v2">
          <div className="card-icon green-gradient">
            <TrendingUp size={24} />
          </div>
          <div className="card-content">
            <span className="card-label">Belegd vermogen</span>
            <strong className="card-value">{formatMoney(summary.totalValue - summary.cashBalance)}</strong>
            <small className="card-meta">{positions.length} posities</small>
          </div>
        </div>

        <div className="summary-card-v2">
          <div className="card-icon orange-gradient">
            <Banknote size={24} />
          </div>
          <div className="card-content">
            <span className="card-label">Cash</span>
            <strong className="card-value">{formatMoney(summary.cashBalance)}</strong>
            <small className="card-meta">
              {((summary.cashBalance / summary.totalValue) * 100).toFixed(1)}% allocatie
            </small>
          </div>
        </div>

        <div className="summary-card-v2 card-positive">
          <div className="card-icon success-gradient">
            <TrendingUp size={24} />
          </div>
          <div className="card-content">
            <span className="card-label">Totale P/L</span>
            <strong className="card-value positive">
              +{formatMoney(summary.totalGain)}
            </strong>
            <small className="card-meta">
              +{summary.totalGainPercent.toFixed(2)}% rendement
            </small>
          </div>
        </div>
      </div>

      <div className="dashboard-grid-2col">
        <div className="dashboard-card">
          <div className="card-header-dash">
            <h3>Performance</h3>
            <span className="badge-info">12 maanden</span>
          </div>
          <div className="card-body-dash">
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={performanceData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="performanceGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="0" stroke="#f1f5f9" vertical={false} />
                <XAxis
                  dataKey="date"
                  stroke="#cbd5e1"
                  fontSize={11}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  stroke="#cbd5e1"
                  fontSize={11}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
                  width={50}
                />
                <Tooltip
                  contentStyle={{
                    background: 'white',
                    border: 'none',
                    borderRadius: '12px',
                    padding: '0.875rem 1rem',
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08), 0 2px 4px rgba(0, 0, 0, 0.04)',
                    fontSize: '0.875rem'
                  }}
                  labelStyle={{
                    color: '#64748b',
                    fontWeight: 600,
                    marginBottom: '0.25rem'
                  }}
                  formatter={(value) => [`$${Number(value).toLocaleString('en-US', {minimumFractionDigits: 2})}`, 'Portfolio Waarde']}
                  cursor={{ stroke: '#e2e8f0', strokeWidth: 1 }}
                />
                <Area
                  type="monotone"
                  dataKey="value"
                  stroke="#3b82f6"
                  strokeWidth={2.5}
                  fill="url(#performanceGradient)"
                  dot={false}
                  animationDuration={800}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="dashboard-card">
          <div className="card-header-dash">
            <h3>Allocatie</h3>
            <span className="badge-info">{positions.length} posities</span>
          </div>
          <div className="card-body-dash">
            <ResponsiveContainer width="100%" height={300}>
              <RechartsPieChart>
                <Pie
                  data={allocationData}
                  cx="50%"
                  cy="50%"
                  innerRadius={65}
                  outerRadius={105}
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${percent.toFixed(1)}%`}
                  labelLine={{
                    stroke: '#cbd5e1',
                    strokeWidth: 1
                  }}
                  paddingAngle={2}
                  stroke="white"
                  strokeWidth={2}
                >
                  {allocationData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    background: 'white',
                    border: 'none',
                    borderRadius: '12px',
                    padding: '0.875rem 1rem',
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08), 0 2px 4px rgba(0, 0, 0, 0.04)',
                    fontSize: '0.875rem'
                  }}
                  labelStyle={{
                    color: '#64748b',
                    fontWeight: 600,
                    marginBottom: '0.25rem'
                  }}
                  formatter={(value, name, props) => [
                    `$${Number(value).toLocaleString('en-US', {minimumFractionDigits: 2})} (${props.payload.percent.toFixed(1)}%)`,
                    name
                  ]}
                />
              </RechartsPieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="dashboard-card">
        <div className="card-header-dash">
          <h3>Open posities</h3>
          <span className="badge-primary">{positions.length}</span>
        </div>

        <div className="table-container">
          <table className="modern-table">
            <thead>
              <tr>
                <th>Asset</th>
                <th className="right">Aantal</th>
                <th className="right">Gem. koop</th>
                <th className="right">Koers</th>
                <th className="right">Waarde</th>
                <th className="right">P/L</th>
                <th className="right">P/L %</th>
              </tr>
            </thead>

            <tbody>
              {positions.map((pos, i) => (
                <tr key={i}>
                  <td>
                    <div className="asset-cell">
                      <StockLogo symbol={pos.symbol} size={32} />
                      <strong>{pos.symbol}</strong>
                    </div>
                  </td>
                  <td className="right mono">{pos.shares}</td>
                  <td className="right mono">{formatMoney(pos.avgPrice)}</td>
                  <td className="right mono text-muted">{formatMoney(pos.currentPrice)}</td>
                  <td className="right mono font-semibold">{formatMoney(pos.currentValue)}</td>
                  <td className={`right mono font-semibold ${pos.gain >= 0 ? "text-success" : "text-danger"}`}>
                    {pos.gain >= 0 ? '+' : ''}{formatMoney(pos.gain)}
                  </td>
                  <td className={`right mono font-semibold ${pos.gainPercent >= 0 ? "text-success" : "text-danger"}`}>
                    {pos.gainPercent >= 0 ? '+' : ''}{pos.gainPercent.toFixed(2)}%
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <LockedActionPrompt
        title="Upload je eigen portfolio"
        message="Maak een gratis account aan om je eigen DeGiro CSV bestanden te uploaden en je echte portfolio te analyseren."
      />

      <div className="dashboard-card">
        <div className="card-header-dash">
          <h3>Gesloten posities</h3>
          <span className="badge-secondary">{closedPositions.length}</span>
        </div>

        {showClosedPositions ? (
          <div className="table-container">
            <table className="modern-table">
              <thead>
                <tr>
                  <th>Asset</th>
                  <th className="right">Aantal</th>
                  <th className="right">Koop</th>
                  <th className="right">Verkoop</th>
                  <th className="right">P/L</th>
                  <th className="right">P/L %</th>
                </tr>
              </thead>
              <tbody>
                {closedPositions.map((pos, i) => (
                  <tr key={i}>
                    <td>
                      <div className="asset-cell">
                        <StockLogo symbol={pos.symbol} size={32} />
                        <strong>{pos.symbol}</strong>
                      </div>
                    </td>
                    <td className="right mono">{pos.shares}</td>
                    <td className="right mono">{formatMoney(pos.buyPrice)}</td>
                    <td className="right mono">{formatMoney(pos.sellPrice)}</td>
                    <td className="right mono font-semibold text-success">
                      +{formatMoney(pos.gain)}
                    </td>
                    <td className="right mono font-semibold text-success">
                      +{pos.gainPercent.toFixed(2)}%
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="card-body-dash">
            <button
              onClick={() => setShowClosedPositions(true)}
              style={{
                width: '100%',
                padding: '1rem',
                background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.05) 0%, rgba(59, 130, 246, 0.02) 100%)',
                border: '1px solid rgba(59, 130, 246, 0.2)',
                borderRadius: '12px',
                color: '#3b82f6',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, rgba(59, 130, 246, 0.05) 100%)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'linear-gradient(135deg, rgba(59, 130, 246, 0.05) 0%, rgba(59, 130, 246, 0.02) 100%)';
              }}
            >
              Bekijk {closedPositions.length} gesloten posities
            </button>
          </div>
        )}
      </div>

      <Link to="/register" style={{ textDecoration: 'none' }}>
        <div className="dashboard-card transactions-link-card">
          <div className="card-body-dash" style={{ padding: '2rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div className="card-icon" style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '12px',
                  background: 'linear-gradient(135deg, #3b82f6, #2563eb)'
                }}>
                  <UserPlus size={24} style={{ color: 'white' }} />
                </div>
                <div>
                  <h3 style={{ margin: 0, fontSize: '1.125rem', fontWeight: 600, color: '#1e293b' }}>
                    Start nu gratis
                  </h3>
                  <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.875rem', color: '#64748b' }}>
                    Maak een gratis account aan en upload je eigen portfolio
                  </p>
                </div>
              </div>
              <ArrowRight size={24} style={{ color: '#3b82f6', flexShrink: 0 }} />
            </div>
          </div>
        </div>
      </Link>
    </PageContainer>
  );
}
