# FEATURE: Kalkulatorer (Calculators) Page

**Status**: Backlog
**Created**: 2025-11-29
**Priority**: Medium
**Labels**: page, calculators, frontend
**Estimated Effort**: Simple - 1 hour

## Context & Motivation

The Kalkulatorer page is the entry point to all financial calculators, showing a 2x2 grid of calculator cards.

## Reference

Design file: `.docs/design-drafts/draft-1-kalkulatorer.html`

## Desired Outcome

Complete Kalkulatorer page with calculator grid.

## Acceptance Criteria

- [ ] Update `/frontend/src/features/calculators/CalculatorsPage.tsx`
- [ ] Centered PageHeader with title and subtitle
- [ ] 2x2 grid of CalculatorCards
- [ ] Cards: Renters rente, F.I.R.E. kalkulator, Lånekalkulator, Monte Carlo
- [ ] Each card links to respective calculator page
- [ ] Staggered fade-in animation

## Technical Approach

```tsx
// CalculatorsPage.tsx
export function CalculatorsPage() {
  const calculators = [
    {
      icon: '📈',
      title: 'Renters rente',
      description: 'Se hvordan sparingen din vokser over tid med compound interest.',
      href: '/kalkulatorer/compound',
      iconBg: 'rgba(139, 154, 125, 0.15)'
    },
    {
      icon: '🎯',
      title: 'F.I.R.E. kalkulator',
      description: 'Beregn hvor lang tid det tar å nå økonomisk uavhengighet.',
      href: '/kalkulatorer/fire',
      iconBg: 'rgba(184, 197, 208, 0.3)'
    },
    {
      icon: '🏠',
      title: 'Lånekalkulator',
      description: 'Beregn månedlige avdrag og total rentekostnad på lån.',
      href: '/kalkulatorer/loan',
      iconBg: 'rgba(196, 164, 132, 0.2)'
    },
    {
      icon: '🎲',
      title: 'Monte Carlo',
      description: 'Simuler tusenvis av scenarioer for å teste pensjonsplanen din.',
      href: '/kalkulatorer/monte-carlo',
      iconBg: 'rgba(44, 44, 44, 0.08)'
    }
  ];

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
              {...calc}
              className={`animate-fade-up animate-delay-${index + 1}`}
            />
          ))}
        </div>
      </div>
    </main>
  );
}
```

```css
.calc-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
}

@media (max-width: 600px) {
  .calc-grid {
    grid-template-columns: 1fr;
  }
}
```

## Dependencies

- `027-FEATURE-page-header-component.md`
- `058-FEATURE-calculator-card-component.md`

---

**Next Steps**: Implement after calculator card component
