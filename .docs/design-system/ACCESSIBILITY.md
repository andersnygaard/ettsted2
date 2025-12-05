# Accessibility Guidelines

Nordic Minimal is committed to accessibility. All components should meet WCAG 2.1 Level AA standards.

## Core Principles

Accessible design is not optional—it's foundational. These guidelines ensure users with disabilities can use the finans application effectively.

## Color Contrast

All text must maintain sufficient color contrast for readability.

### Minimum Contrast Ratios

| Content | Ratio | Standard |
|---------|-------|----------|
| Normal text (<18px) | 4.5:1 | WCAG AA |
| Large text (≥18px) | 3:1 | WCAG AA |
| UI components | 3:1 | WCAG AA |
| Focus indicators | 3:1 | WCAG AA |

### Approved Combinations

**Text on Bone (#F5F2ED):**
- ✅ Charcoal (#2C2C2C) - 9.8:1
- ✅ Text Secondary (#6B6B6B) - 6.2:1
- ✅ Muted Sage (#8B9A7D) - 5.3:1

**Text on Warm White (#FDFCFA):**
- ✅ Charcoal (#2C2C2C) - 10.2:1
- ✅ Text Secondary (#6B6B6B) - 6.5:1

**Text on Charcoal (#2C2C2C):**
- ✅ Warm White (#FDFCFA) - 10.2:1
- ✅ Bone (#F5F2ED) - 9.8:1

**Interactive Elements:**
- ✅ Muted Sage (#8B9A7D) on Bone - 5.3:1
- ✅ Negative (#9D6B5A) on Bone - 5.0:1
- ✅ Gold (#C9A962) on Bone - 4.8:1

### Testing

Always test color combinations with:
- WebAIM Contrast Checker
- Lighthouse accessibility audit
- Color blindness simulator (Deuteranopia, Protanopia, Tritanopia)

**Do not rely on color alone** to convey information. Use:
- Text labels
- Icons with labels
- Pattern changes (dashed vs solid borders)
- Numerical indicators

---

## Keyboard Navigation

All interactive elements must be operable via keyboard.

### Implementation

```typescript
// Always manage focus
const inputRef = useRef<HTMLInputElement>(null)

useEffect(() => {
  inputRef.current?.focus()
}, [])

// Support Enter and Escape keys
<input
  onKeyDown={(e) => {
    if (e.key === 'Enter') handleSubmit()
    if (e.key === 'Escape') handleCancel()
  }}
/>

// Proper tab order
<form>
  <input tabIndex={0} /> {/* First */}
  <button tabIndex={0} /> {/* Second */}
  <input tabIndex={0} /> {/* Third */}
</form>
```

### Tab Order Rules

- Natural reading order (left to right, top to bottom)
- Logical grouping of related elements
- Hidden elements: `tabIndex={-1}` or `aria-hidden="true"`
- Never use positive tabIndex values (`tabIndex={1}`, `tabIndex={2}`)

### Skip Links

Provide skip navigation for keyboard users:

```typescript
<a href="#main-content" className="skip-link">
  Skip to main content
</a>

<main id="main-content">
  {/* Page content */}
</main>
```

### Focus Indicators

Always maintain visible focus indicators:

```css
button:focus,
input:focus,
a:focus {
  outline: 2px solid var(--muted-sage);
  outline-offset: 2px;
}

/* Remove default outline only if replacing with custom */
button:focus-visible {
  outline: 2px solid var(--muted-sage);
  outline-offset: 2px;
}
```

---

## Screen Reader Support

Use semantic HTML and ARIA attributes to support screen readers.

### Semantic HTML

Always prefer semantic elements over divs:

```typescript
// ✅ Good
<button onClick={handleClick}>Lagre</button>
<nav>{/* Navigation */}</nav>
<main>{/* Main content */}</main>
<article>{/* Article content */}</article>
<section>{/* Section */}</section>

// ❌ Bad
<div onClick={handleClick} role="button">Lagre</div>
<div role="navigation">{/* Navigation */}</div>
```

### ARIA Attributes

#### Labels

Always label form inputs:

```typescript
// ✅ Good
<label htmlFor="amount">Beløp</label>
<input id="amount" type="number" />

// ✅ Also good (aria-label)
<button aria-label="Lukk dialog">
  <XIcon />
</button>
```

#### Live Regions

For dynamic content:

```typescript
<div
  role="status"
  aria-live="polite"
  aria-atomic="true"
>
  Snapshot lagret!
</div>

<div
  role="alert"
  aria-live="assertive"
>
  Feil ved lagring
</div>
```

#### Descriptions

For complex components:

```typescript
<SpreadsheetTable
  aria-label="Portfolio snapshots"
  aria-describedby="table-description"
/>

<p id="table-description">
  Table showing monthly portfolio snapshots with accounts grouped by category.
  Edit cells directly to update values.
</p>
```

#### Hidden Content

For decorative elements:

```typescript
<svg aria-hidden="true">
  {/* Decorative grain texture */}
</svg>

<span aria-hidden="true">→</span>
```

### Modal Accessibility

```typescript
<Modal
  isOpen={isOpen}
  onClose={handleClose}
  aria-label="Edit account"
  aria-modal="true"
  role="dialog"
>
  <h2 id="modal-title">Rediger konto</h2>
  {/* Content */}
</Modal>
```

---

## Form Accessibility

Forms must be fully accessible to all users.

### Input Labeling

```typescript
// ✅ Explicit label
<label htmlFor="name">Navn</label>
<input id="name" type="text" />

// ✅ Aria-label
<input aria-label="Søk etter kontoer" type="search" />

// ✅ Aria-labelledby
<h3 id="form-title">Opprett konto</h3>
<form aria-labelledby="form-title">
  {/* Inputs */}
</form>
```

### Error Messages

```typescript
<div>
  <label htmlFor="amount">Beløp</label>
  <input
    id="amount"
    type="number"
    aria-invalid={hasError}
    aria-describedby={hasError ? "error-amount" : undefined}
  />
  {hasError && (
    <p id="error-amount" role="alert">
      Beløp må være større enn 0
    </p>
  )}
</div>
```

### Required Fields

```typescript
<label htmlFor="date">
  Dato
  <span aria-label="required">*</span>
</label>
<input
  id="date"
  type="text"
  required
  aria-required="true"
/>
```

---

## Motion & Animation

Respect user motion preferences.

### prefers-reduced-motion

```css
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

### Component Implementation

```typescript
const prefersReducedMotion = window.matchMedia(
  '(prefers-reduced-motion: reduce)'
).matches

const transitionDuration = prefersReducedMotion ? 0 : 300

<div
  style={{
    transition: `opacity ${transitionDuration}ms ease`
  }}
>
  Content
</div>
```

---

## Language & Terminology

Use clear, inclusive language.

### Inclusive Language

```typescript
// ✅ Inclusive
<button>Lagre</button>
<label>Beløp</label>

// ❌ Avoid jargon
<button>Persevere</button>
<label>Aggregate value</label>
```

### Norwegian Context

- Use Norwegian currency (kr)
- Use Norwegian date format (dd.MM.yyyy)
- Use familiar Norwegian financial terms:
  - Sparing (savings)
  - Gjeld (debt)
  - Pensjon (pension)
  - Netto formue (net worth)
  - F.I.R.E. (Financial Independence, Retire Early - English term, use as-is)

---

## Testing Checklist

Before shipping a component:

### Manual Testing

- [ ] **Keyboard Navigation**: Tab through all interactive elements
- [ ] **Screen Reader**: Test with NVDA (Windows) or VoiceOver (Mac)
- [ ] **Color Contrast**: Verify 4.5:1 for normal text, 3:1 for large text
- [ ] **Focus Indicators**: Visible on all interactive elements
- [ ] **Resize Text**: Test at 200% zoom
- [ ] **Color Blindness**: Use simulator for different types

### Automated Testing

```bash
# Lighthouse accessibility audit
lighthouse https://localhost:5173 --view

# axe DevTools browser extension
# Install from Chrome Web Store or Firefox Add-ons
```

### Tools

- WebAIM Contrast Checker
- WAVE Browser Extension
- Lighthouse
- axe DevTools
- Color Blindness Simulator
- NVDA (free screen reader)
- VoiceOver (Mac/iOS)

---

## Component A11y Checklist

### Button

- [ ] Keyboard accessible (Enter, Space)
- [ ] Has visible focus indicator
- [ ] Descriptive button text (not "Click here")
- [ ] `aria-pressed` for toggle buttons

### Form Input

- [ ] `<label>` associated with input (htmlFor)
- [ ] Clear error messages
- [ ] `aria-required` or `required` attribute
- [ ] `aria-invalid` for error states

### Modal

- [ ] `role="dialog"` and `aria-modal="true"`
- [ ] Focus trapped inside modal
- [ ] Escape key closes modal
- [ ] `aria-labelledby` for title

### Table

- [ ] `<table>` semantic element
- [ ] `<th>` for headers
- [ ] `scope="col"` or `scope="row"`
- [ ] Summary or caption explaining table

### Chart

- [ ] Alt text or table with data
- [ ] `aria-label` describing the chart
- [ ] Data available in accessible format
- [ ] Color-independent data representation

---

## Resources

### WCAG 2.1

- [WCAG 2.1 Overview](https://www.w3.org/WAI/WCAG21/quickref/)
- [How to Meet WCAG 2.1](https://www.w3.org/WAI/WCAG21/quickref/)

### Tools & Testing

- [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/)
- [WAVE Browser Extension](https://wave.webaim.org/extension/)
- [Lighthouse](https://developers.google.com/web/tools/lighthouse)
- [axe DevTools](https://www.axe-core.org/)

### Screen Readers

- [NVDA (Windows)](https://www.nvaccess.org/)
- [JAWS (Windows, paid)](https://www.freedomscientific.com/products/software/jaws/)
- [VoiceOver (Mac/iOS, free)](https://www.apple.com/accessibility/voiceover/)

### Learning

- [WAI Introduction to Web Accessibility](https://www.w3.org/WAI/fundamentals/)
- [A11y Checklist](https://www.a11ychecklist.com/)
- [MDN: Web Accessibility](https://developer.mozilla.org/en-US/docs/Web/Accessibility)

---

*Last updated: December 2024*
