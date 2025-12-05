# Design Principles - Nordic Minimal

## Philosophy

Nordic Minimal is rooted in Scandinavian design: clean, functional, and beautiful. It prioritizes clarity and purpose, using warm muted tones and elegant typography to create a sophisticated yet approachable interface for managing wealth and financial data.

## Five Core Tenets

### 1. Clarity

Information should be presented clearly without clutter. Users should immediately understand:

- Their financial position
- How to navigate the application
- What actions they can take

**In Practice:**
- Use hierarchy with typography and spacing
- White space is essential; don't overcrowd
- Single primary action per view
- Clear labels and descriptive text

### 2. Warmth

Cold, sterile interfaces undermine trust when dealing with finances. Nordic Minimal uses warm muted tones to create an approachable, human atmosphere.

**In Practice:**
- Bone (#F5F2ED) as primary background—warm, not stark
- Soft accents: Muted Sage, Soft Terracotta, Pale Blue
- Avoid blacks and pure whites
- Gold (#C9A962) reserved for milestones (warmth + celebration)

### 3. Elegance

Elegant design doesn't mean ornate. It means purposeful, refined, and intentional. Every visual element serves a function.

**In Practice:**
- Cormorant Garamond for headings (light, elegant serif)
- Generous whitespace and breathing room
- Subtle grain texture, not aggressive
- Minimal shadows and transitions
- Consistent border radius (2px, 4px)

### 4. Consistency

Users should experience a cohesive interface across all pages. Consistency builds confidence and reduces cognitive load.

**In Practice:**
- Use CSS variables for all colors, typography, spacing
- Follow the spacing scale strictly
- Consistent button styles, card patterns, form inputs
- Predictable hover/focus states
- Familiar navigation patterns

### 5. Accessibility

Beautiful design means nothing if it excludes users. A11y is not optional—it's foundational.

**In Practice:**
- Color contrast ratios ≥ 4.5:1 for text
- Keyboard navigation for all interactive elements
- Screen reader friendly markup and labels
- Clear focus indicators
- Inclusive language and labeling

## Design Attitudes

### Data Over Decoration

Financial data is the hero. Design should support understanding, not distract:

- Numbers use JetBrains Mono (monospace, precise)
- Charts use the Nordic color palette (cohesive, not rainbow)
- Avoid decorative flourishes that don't inform

### Functional Beauty

Every visual element should serve a purpose:

- Grain texture adds tactile quality, not noise
- Shadow elevation shows hierarchy
- Gold color signals achievement, not random highlighting
- Border radius (2px) provides softness without excess

### Progressive Disclosure

Complex data (SpreadsheetTable) uses column groups and toggles:

- Users see summaries first
- Detailed breakdowns available on demand
- Reduces cognitive load for new users

### Timeless > Trendy

Nordic Minimal is designed to age well:

- Classic typography (Cormorant Garamond, DM Sans)
- Muted tones don't feel dated
- Minimal use of effects (grain, shadows) instead of passing trends
- Timeless component patterns

## Norwegian Context

The application is for Norwegian users tracking wealth in Norwegian language:

- Numbers: `123 456,78 kr` (space thousands, comma decimal)
- Dates: `dd.MM.yyyy`
- Terminology: F.I.R.E. (Financial Independence, Retire Early), Netto formue (net worth), Sparing (savings), Gjeld (debt), Pensjon (pension)

Design should feel natural and familiar to Norwegian users without stereotypes.

## Brand Expression

Nordic Minimal is sophisticated but not corporate. It's:

- Refined without being stuffy
- Professional without being cold
- Modern without being trendy
- Warm without being overly casual

This tone extends to copy, interactions, and visual language.

---

*Last updated: December 2024*
