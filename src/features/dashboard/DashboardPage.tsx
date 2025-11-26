import { Link } from 'react-router-dom';

export default function DashboardPage() {
  return (
    <main style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem 1rem' }}>
      <h1>Dashboard</h1>

      <section style={{ marginTop: '2rem' }}>
        <h2>Available Tools</h2>
        <nav style={{ display: 'flex', gap: '1rem' }}>
          <Link to="/calculator" style={{
            padding: '0.75rem 1.5rem',
            backgroundColor: 'var(--primary)',
            color: 'var(--on-primary)',
            textDecoration: 'none',
            borderRadius: '4px'
          }}>
            Renter/Rentesrente Kalkulator
          </Link>
        </nav>
      </section>
    </main>
  );
}
