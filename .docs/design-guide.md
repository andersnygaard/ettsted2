# Finans Design Guide

> Nordic Minimal Design System for the Finans portfolio tracking application.

## Overview

The Finans design system is inspired by Scandinavian design principles: clean, spacious layouts with warm muted tones and elegant typography. This guide documents the design tokens, component patterns, and usage guidelines.

---

## Color Palette

### Primary Colors

| Name | Variable | Hex Value | Usage |
|------|----------|-----------|-------|
| Bone | `--bone` | `#F5F2ED` | Primary background |
| Warm White | `--warm-white` | `#FDFCFA` | Cards, elevated surfaces |
| Charcoal | `--charcoal` | `#2C2C2C` | Primary text |

### Accent Colors

| Name | Variable | Hex Value | Usage |
|------|----------|-----------|-------|
| Muted Sage | `--muted-sage` | `#8B9A7D` | Positive values, savings, focus states |
| Soft Terracotta | `--soft-terracotta` | `#C4A484` | Warm accent |
| Pale Blue | `--pale-blue` | `#B8C5D0` | Secondary accent, chart colors |

### Semantic Colors

| Name | Variable | Hex Value | Usage |
|------|----------|-----------|-------|
| Text Secondary | `--text-secondary` | `#6B6B6B` | Muted text, labels |
| Gold | `--gold` | `#C9A962` | Milestone highlights, achievements |
| Positive | `--positive` | `#5A7D5A` | Positive changes, growth indicators |
| Negative | `--negative` | `#9D6B5A` | Negative changes, losses, errors |
| Border | `--border` | `rgba(44, 44, 44, 0.08)` | Dividers, subtle borders |

### Usage Guidelines

- **Always use CSS variables** instead of hardcoded hex values
- **Bone** is the page background; **Warm White** is for cards/surfaces
- Use **Muted Sage** for positive financial indicators (savings, gains)
- Use **Negative** sparingly for errors and debt indicators
- **Gold** is reserved for milestone achievements only

---

## Typography

### Font Families

| Font | Variable | Usage | Weights |
|------|----------|-------|---------|
| Cormorant Garamond | `--font-heading` | Headings, large numbers (HeroNumber) | 300, 400, 500, 600 |
| DM Sans | `--font-body` | Body text, UI elements, labels | 400, 500, 700 |
| JetBrains Mono | `--font-mono` | Numbers, data values, code | 400, 500, 600 |

### Type Scale

| Name | Size | Element |
|------|------|---------|
| Hero | 64px | HeroNumber value |
| H1 | 48px | Page titles (Oversikt greeting) |
| H2 | 32px | Section headings |
| H3 | 24px | Card titles |
| Body | 16px | Paragraph text |
| Small | 14px | Secondary text |
| Label | 11px | Uppercase labels, button text |

### Usage Guidelines

- **Headings**: Use Cormorant Garamond with light weight (300) for elegance
- **Body**: Use DM Sans for readability in UI elements
- **Numbers**: Always use JetBrains Mono for financial values
- **Labels**: 11px uppercase with 0.08em letter-spacing
- **Line height**: 1.2 for headings, 1.5 for body text

---

## Number Formatting

All numbers follow Norwegian locale conventions:

| Type | Format | Example |
|------|--------|---------|
| Currency | Space thousands, comma decimal | `1 234 567,89 kr` |
| Percentage | Comma decimal | `+2,33%` |
| Date | dd.MM.yyyy | `01.01.2024` |

### Implementation

```typescript
import { formatNumber, formatCurrency, formatPercentage } from '@finans/components';

formatNumber(1234567.89);     // "1 234 567,89"
formatCurrency(1234567.89);   // "1 234 567,89 kr"
formatPercentage(2.33);       // "+2,33%"
```

---

## Spacing Scale

| Token | Size | Usage |
|-------|------|-------|
| xs | 4px | Tight gaps |
| sm | 8px | Small padding |
| md | 12px | Compact spacing |
| base | 16px | Default spacing |
| lg | 20px | Component padding |
| xl | 24px | Section gaps |
| 2xl | 32px | Large gaps |
| 3xl | 48px | Section spacing |
| 4xl | 64px | Page sections |
| 5xl | 80px | Major sections |

### Container Widths

| Name | Width | Usage |
|------|-------|-------|
| wide | 1200px | Dashboard, portfolio pages |
| narrow | 900px | Focused pages (calculators, forms) |
| xs | 480px | Login, modals, narrow content |

---

## Button Variants

### Primary Button

```css
background: var(--charcoal);
color: var(--warm-white);
```

**When to use:**
- Main action on the page (submit, save, confirm)
- Single primary action per view

**Examples:** Lagre, Opprett, Bekreft

### Secondary Button

```css
background: transparent;
border: 1px solid var(--muted-sage);
color: var(--charcoal);
```

**When to use:**
- Alternative actions or cancel buttons
- Secondary navigation

**Examples:** Avbryt, Tilbake, Eksporter

### Missing Variants (To Add)

| Variant | Style | Usage |
|---------|-------|-------|
| Danger | `background: var(--negative)` | Destructive actions (delete, remove) |
| Subtle | `background: transparent; border: none` | Tertiary actions (edit inline, minor toggles) |

---

## Visual Effects

### Grain Texture

All pages have a subtle grain texture overlay using an SVG noise filter:

```css
body::before {
  content: '';
  position: fixed;
  background-image: url('data:image/svg+xml,...');
  pointer-events: none;
  opacity: 0.08;
}
```

### Hover States

- Cards: `translateY(-2px)` with subtle shadow
- Buttons: `translateY(-1px)` with darker background
- Links: Color transition to `--muted-sage`

### Animations

- **Fade up**: Elements animate from opacity 0 to 1 with upward motion
- **Stagger**: Multiple elements animate in sequence (100ms delay each)
- **Transitions**: Use `--transition-fast` (0.15s) for micro-interactions

### Border Radius

| Size | Value | Usage |
|------|-------|-------|
| Default | 2px | Cards, buttons, inputs |
| Round | 4px | Small elements |
| Circle | 50% | Avatars |

---

## Component Categories

### Layout Components

| Component | Purpose |
|-----------|---------|
| Container | Max-width wrapper with padding |
| PageHeader | Title + subtitle + optional actions |
| SectionLink | Navigation card with arrow |
| CalculatorCard | Calculator tool card |

### Data Display

| Component | Purpose |
|-----------|---------|
| HeroNumber | Large centered value with change badge |
| StatCard | Clickable stat with value + label |
| StatsRow | Horizontal row of 3-4 stats |
| MilestoneCard | Progress toward goal |
| SpreadsheetTable | Complex data table with groups |

### Charts

| Component | Purpose |
|-----------|---------|
| AreaChart | Single series area chart |
| StackedAreaChart | Multiple series stacked |
| DonutChart | Percentage donut/ring |

### Forms

| Component | Purpose |
|-----------|---------|
| NumberInput | Norwegian-formatted number input |
| DateInput | dd.MM.yyyy date picker |
| ProgressBar | Horizontal progress with labels |

### UI Primitives

| Component | Purpose |
|-----------|---------|
| Button | Primary/secondary action button |
| Card | Elevated container |
| Modal | Dialog overlay |
| Avatar | User initials circle |
| Breadcrumb | Navigation path |
| Skeleton | Loading placeholder |

---

## Responsive Breakpoints

| Name | Width | Target |
|------|-------|--------|
| Mobile | max-width: 480px | Small phones |
| Tablet | max-width: 768px | Tablets, large phones |
| Desktop | max-width: 1024px | Small desktops |
| Wide | max-width: 1200px | Standard desktops |

### Grid Patterns

```css
/* 4-column grid (dashboard stats) */
grid-template-columns: repeat(4, 1fr);

/* Responsive collapse */
@media (max-width: 1024px) { repeat(2, 1fr); }
@media (max-width: 600px) { 1fr; }
```

---

## Storybook

View all components in Storybook:

```bash
pnpm --filter components storybook
```

### Key Stories

- `DesignSystem/Foundations` - Colors, typography, buttons
- `Demo/AllComponents` - Kitchen sink demo
- `Demo/DashboardLayout` - Dashboard composition
- `Demo/FormsLayout` - Form patterns

---

## Implementation Checklist

When creating new components:

- [ ] Use CSS variables for all colors
- [ ] Use font family variables (`--font-heading`, `--font-body`, `--font-mono`)
- [ ] Add responsive breakpoints for 768px and 480px
- [ ] Include hover/focus states
- [ ] Use BEM naming for CSS classes
- [ ] Export TypeScript types
- [ ] Create Storybook story with variants
- [ ] Format numbers with Norwegian locale

---

## Files Reference

- **CSS Variables**: `components/.storybook/preview.css`
- **Design Drafts**: `.docs/design-drafts/draft-1-*.html`
- **Storybook Stories**: `components/src/**/*.stories.tsx`

---

*Last updated: December 2024*
