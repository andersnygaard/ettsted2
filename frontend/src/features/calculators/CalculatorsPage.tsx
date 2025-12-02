import { PageHeader, CalculatorCard } from '@finans/components';
import './CalculatorsPage.css';

/**
 * Calculator data for the grid
 * Each calculator has an icon, title, description, link, and icon background color
 */
const calculators = [
  {
    icon: '📈',
    title: 'Renters rente',
    description: 'Se hvordan sparingen din vokser over tid med compound interest.',
    href: '/kalkulatorer/compound',
    iconBg: 'rgba(139, 154, 125, 0.15)', // Muted sage
  },
  {
    icon: '🎯',
    title: 'F.I.R.E. kalkulator',
    description: 'Beregn hvor lang tid det tar å nå økonomisk uavhengighet.',
    href: '/kalkulatorer/fire',
    iconBg: 'rgba(184, 197, 208, 0.3)', // Pale blue
  },
  {
    icon: '🏠',
    title: 'Lånekalkulator',
    description: 'Beregn månedlige avdrag og total rentekostnad på lån.',
    href: '/kalkulatorer/loan',
    iconBg: 'rgba(196, 164, 132, 0.2)', // Soft terracotta
  },
  {
    icon: '🎲',
    title: 'Monte Carlo',
    description: 'Simuler tusenvis av scenarioer for å teste pensjonsplanen din.',
    href: '/kalkulatorer/monte-carlo',
    iconBg: 'rgba(44, 44, 44, 0.08)', // Charcoal light
  },
];

/**
 * CalculatorsPage Component
 *
 * Landing page for all financial calculators.
 * Displays a 2x2 grid of calculator cards with staggered animations.
 *
 * Based on Nordic Minimal design from draft-1-kalkulatorer.html
 */
function CalculatorsPage() {
  return (
    <main className="calculators-page">
      <div className="container container--narrow">
        <PageHeader
          title="Kalkulatorer"
          subtitle="Verktøy for å planlegge din økonomi"
          centered
        />

        <div className="calc-grid">
          {calculators.map((calc, index) => (
            <CalculatorCard
              key={calc.href}
              icon={calc.icon}
              title={calc.title}
              description={calc.description}
              href={calc.href}
              iconBg={calc.iconBg}
              className={`animate-fade-up animate-delay-${index + 1}`}
            />
          ))}
        </div>
      </div>
    </main>
  );
}

export default CalculatorsPage;
