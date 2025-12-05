# Design Tokens Reference

Complete CSS variable reference for the Nordic Minimal design system. All tokens are defined in `frontend/src/styles/tokens.css` and available throughout the application via CSS custom properties.

## Colors

### Primary Backgrounds

| Token | Value | Usage |
|-------|-------|-------|
| `--bone` | `#F5F2ED` | Primary page background—warm, muted base |
| `--warm-white` | `#FDFCFA` | Cards, elevated surfaces, modals |
| `--surface` | `#faf6f4` | Slightly darker surface for depth |

### Text Colors

| Token | Value | Usage |
|-------|-------|-------|
| `--charcoal` | `#2C2C2C` | Primary text, headings |
| `--text-secondary` | `#6B6B6B` | Secondary text, labels, muted content |

### Accent Colors

| Token | Value | Usage |
|-------|-------|-------|
| `--muted-sage` | `#8B9A7D` | Positive values, savings, focus states |
| `--sage-dark` | `#7A8A6D` | Darker sage for emphasis |
| `--soft-terracotta` | `#C4A484` | Warm accent, secondary highlights |
| `--pale-blue` | `#B8C5D0` | Secondary accent, chart series |
| `--gold` | `#C9A962` | Milestone achievements |
| `--gold-light` | `#D4B876` | Gold hover/gradient states |
| `--orange` | `#D4956A` | Orange accent (alternative) |

### Semantic Colors

| Token | Value | Usage |
|-------|-------|-------|
| `--positive` | `#5A7D5A` | Positive changes, growth, gains |
| `--negative` | `#9D6B5A` | Negative changes, debt, losses |
| `--negative-dark` | `#8b5d4d` | Darker negative for emphasis |

### Hover & Variant States

| Token | Value | Usage |
|-------|-------|-------|
| `--charcoal-light` | `#3a3a3a` | Charcoal gradients |
| `--charcoal-hover` | `#1a1a1a` | Dark charcoal for hover states |

### Category Colors (SpreadsheetTable)

| Token | Value | Usage |
|-------|-------|-------|
| `--category-sparing` | `#6a7a60` | Savings/sparing category |
| `--category-sparing-hover` | `#7a8a70` | Sparing hover state |
| `--category-gjeld` | `#8a7060` | Debt/gjeld category |
| `--category-gjeld-hover` | `#9a8070` | Gjeld hover state |
| `--category-pensjon` | `#5a6d7a` | Pension/pensjon category |
| `--category-pensjon-hover` | `#6a7d8a` | Pensjon hover state |

### Third-Party Brand Colors

| Token | Value | Usage |
|-------|-------|-------|
| `--facebook-blue` | `#1877F2` | Facebook OAuth button |
| `--facebook-blue-hover` | `#166FE5` | Facebook button hover |

### Borders

| Token | Value | Usage |
|-------|-------|-------|
| `--border` | `rgba(44, 44, 44, 0.08)` | Subtle borders, dividers |
| `--border-strong` | `rgba(44, 44, 44, 0.15)` | More visible borders |
| `--border-subtle` | `0.5px solid #efefef` | Very subtle card borders |

## Typography

### Font Families

| Token | Font | Usage |
|-------|------|-------|
| `--font-heading` | Cormorant Garamond | Headings, large numbers, elegant text |
| `--font-body` | DM Sans | Body text, UI labels, navigation |
| `--font-mono` | JetBrains Mono | Numbers, financial data, code |

### Font Sizes

| Token | Size | Usage |
|-------|------|-------|
| `--font-size-xs` | 11px | Small caps, labels, secondary text |
| `--font-size-sm` | 12px | Captions, helper text |
| `--font-size-base` | 14px | Base text size |
| `--font-size-md` | 15px | Body text, descriptions |
| `--font-size-lg` | 22px | Section titles |
| `--font-size-xl` | 32px | Stat values |
| `--font-size-2xl` | 44px | Page headings (H1) |
| `--font-size-3xl` | 48px | Milestone values |
| `--font-size-hero` | 84px | Hero numbers (HeroNumber) |

### Font Weights

| Token | Weight | Usage |
|-------|--------|-------|
| `--font-weight-light` | 300 | Elegant headings, light emphasis |
| `--font-weight-regular` | 400 | Body text, standard weight |
| `--font-weight-medium` | 500 | Labels, button text |
| `--font-weight-semibold` | 600 | Emphasis, strong text |

### Letter Spacing

| Token | Value | Usage |
|-------|-------|-------|
| `--letter-spacing-tight` | -0.02em | Large headings, title tightening |
| `--letter-spacing-normal` | 0 | Standard text |
| `--letter-spacing-wide` | 0.05em | Navigation, headings |
| `--letter-spacing-wider` | 0.1em | Small labels, metadata |
| `--letter-spacing-widest` | 0.12em | Hero labels |
| `--letter-spacing-extra` | 0.15em | Logo text |

## Spacing

### Base Spacing Scale

8px base unit throughout. Use CSS variables instead of hardcoded pixels.

| Token | Size | Usage |
|-------|------|-------|
| `--space-xs` | 8px | Tight spacing, gaps |
| `--space-sm` | 12px | Small padding, compact spacing |
| `--space-md` | 16px | Medium spacing, component padding |
| `--space-lg` | 20px | Large spacing, section gaps |
| `--space-xl` | 24px | Extra large spacing |
| `--space-2xl` | 32px | Section padding |
| `--space-3xl` | 40px | Card padding |
| `--space-4xl` | 48px | Container padding |
| `--space-5xl` | 64px | Page sections |
| `--space-6xl` | 80px | Large sections, margins |

### Container Widths

| Token | Width | Usage |
|-------|-------|-------|
| `--container-max-width` | 1200px | Standard max width (dashboard, portfolio) |
| `--container-narrow` | 900px | Focused pages (calculators, forms) |
| `--container-tight` | 600px | Very focused content (modals, narrow forms) |

## Layout

### Border Radius

| Token | Value | Usage |
|-------|-------|-------|
| `--radius-sm` | 2px | Cards, buttons, inputs—minimal softness |
| `--radius-md` | 4px | Progress bars, small elements |
| `--radius-full` | 50% | Circular elements, avatars |

## Effects

### Shadows

| Token | Value | Usage |
|-------|-------|-------|
| `--shadow-sm` | `0 8px 24px rgba(0, 0, 0, 0.04)` | Subtle lift for cards |
| `--shadow-md` | `0 16px 48px rgba(0, 0, 0, 0.06)` | Hover elevation |
| `--shadow-lg` | `0 24px 64px rgba(0, 0, 0, 0.08)` | Modals, overlays, dropdowns |

### Transitions & Animations

| Token | Value | Usage |
|-------|-------|-------|
| `--transition-fast` | 0.2s ease | Quick interactions, hover states |
| `--transition-medium` | 0.3s ease | Standard transitions, page changes |
| `--transition-slow` | 0.6s ease | Page load animations, entrance effects |

### Opacity

| Token | Value | Usage |
|-------|-------|-------|
| `--opacity-grain` | 0.03 | Grain texture overlay |
| `--opacity-muted` | 0.5 | Muted text on dark backgrounds |
| `--opacity-subtle` | 0.6 | Subtle text, secondary content |
| `--opacity-medium` | 0.12 | Background overlays, disabled states |
| `--opacity-strong` | 0.15 | Stronger overlays, emphasis |

## Z-Index Layers

| Token | Value | Usage |
|-------|-------|-------|
| `--z-base` | 1 | Base layer |
| `--z-dropdown` | 100 | Dropdowns, tooltips |
| `--z-sticky` | 200 | Sticky headers, navigation |
| `--z-grain` | 500 | Grain texture (below modals) |
| `--z-overlay` | 900 | Overlays, backdrop |
| `--z-modal` | 1000 | Modals (above everything) |

## Usage Guidelines

### Colors

- **Always use CSS variables** instead of hardcoded hex values
- **Bone** is the page background; **Warm White** is for cards
- Use **Muted Sage** for positive financial indicators (savings, gains)
- Use **Negative** sparingly for errors and debt
- **Gold** is reserved for milestone achievements only
- Test color contrast (min 4.5:1 for text)

### Typography

- **Headings**: Cormorant Garamond with light weight (300)
- **Body**: DM Sans for readability
- **Numbers**: Always JetBrains Mono for financial values
- **Line height**: 1.2 for headings, 1.5 for body

### Spacing

- Use spacing scale consistently
- Never hardcode pixel values
- Follow the 8px base unit for grid alignment
- Respect margins and padding rules

### Responsive

Breakpoints for common screen sizes:

- Mobile: max-width 480px
- Tablet: max-width 768px
- Desktop: max-width 1024px
- Wide: max-width 1200px

---

*Last updated: December 2024*
