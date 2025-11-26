# Homepage Layout Improvement Plan

## Objective
Fix frontpage layout so elements are equally wide and apply professional homepage design principles.

## Current Issues
- Hero section (`large-padding` + `center-align`) has different width than feature cards grid
- About section (`medium-padding`) not aligned with other sections
- No use of stock_photo_1.png
- Inconsistent spacing across sections
- Limited visual hierarchy

## Solution: Consistent Container + Hero Image Integration

### Approach
1. **Create HomePage.css** - Custom styles for consistent layout
2. **Restructure HomePage.tsx** - Equal-width sections with hero image

### Design Principles Applied (Boag Guidelines)
- **Visual Hierarchy**: Hero (largest) → Features (medium) → About (supporting)
- **Emotional Impact**: Stock photo in hero establishes trust immediately
- **Clear CTA**: Single "Kom i gang" button in hero (user preference)
- **Content Prioritization**: Message before features

---

## File Changes

### 1. Create `src/features/home/HomePage.css`

```css
/* Container alignment */
.home-section {
  max-width: 100%;
  padding-left: 1.5rem;
  padding-right: 1.5rem;
}

/* Hero with image layout */
.home-hero-wrapper {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
  align-items: center;
}

.home-hero-content {
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.home-hero-image {
  width: 100%;
  max-height: 400px;
  object-fit: contain;
}

/* Feature cards grid */
.home-features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.5rem;
}

/* Responsive mobile */
@media (max-width: 768px) {
  .home-hero-wrapper {
    grid-template-columns: 1fr;
  }

  .home-hero-image {
    max-height: 300px;
    order: -1; /* Image on top for mobile */
  }
}
```

### 2. Update `src/features/home/HomePage.tsx`

**Add import:**
```typescript
import './HomePage.css';
```

**Hero Section (lines 28-37):**
Replace center-aligned article with grid layout:
```tsx
<section className="home-section" style={{ marginTop: '2rem' }}>
  <div className="home-hero-wrapper">
    <div className="home-hero-content">
      <h1>Smarte finansverktøy</h1>
      <p className="large-text">
        Få full kontroll over din økonomi med våre enkle og kraftige kalkulatorer.
      </p>
      <button className="extra" onClick={() => setShowLoginDialog(true)}>
        <span>Kom i gang</span>
        <i>arrow_forward</i>
      </button>
    </div>
    <img src="/stock_photo_1.png" alt="Finansiell vekst" className="home-hero-image" />
  </div>
</section>
```

**Feature Cards (lines 39-57):**
Replace BeerCSS grid with custom grid:
```tsx
<section className="home-section" style={{ marginTop: '3rem' }}>
  <div className="home-features-grid">
    <article>
      <i className="extra-large">savings</i>
      <h5>Rentesrente Kalkulator</h5>
      <p>Se hvordan pengene dine vokser over tid med rentesrente-effekten.</p>
    </article>

    <article>
      <i className="extra-large">trending_up</i>
      <h5>Visualiser Veksten</h5>
      <p>Interaktive grafer som viser utviklingen av investeringene dine.</p>
    </article>

    <article>
      <i className="extra-large">security</i>
      <h5>Sikker Innlogging</h5>
      <p>Logg inn trygt med Google eller Facebook.</p>
    </article>
  </div>
</section>
```

**About Section (lines 59-65):**
Add consistent container and border-top:
```tsx
<section
  id="om-oss"
  className="home-section"
  style={{
    marginTop: '3rem',
    paddingTop: '2rem',
    borderTop: '1px solid var(--outline)'
  }}
>
  <h3>Om oss</h3>
  <p>
    Finans App er laget for å hjelpe deg med å ta bedre økonomiske beslutninger.
    Våre verktøy er enkle å bruke og gir deg innsikt i hvordan sparepengene dine kan vokse.
  </p>
</section>
```

---

## Responsive Behavior

**Desktop (>768px):**
- Hero: 2-column grid (text left, image right)
- Features: 3-column auto-fit grid
- All sections: consistent horizontal padding

**Mobile (<768px):**
- Hero: 1-column (image top, text below)
- Features: 1-column
- Maintains equal widths

---

## Key Decisions (User Preferences)
- Hero image: Clean look, no border/shadow
- About section: Border-top only (no background color)
- CTAs: Single hero button only (no card CTAs)

---

## Critical Files
- `src/features/home/HomePage.tsx` - Main restructure
- `src/features/home/HomePage.css` - New stylesheet (create)
- `public/stock_photo_1.png` - Referenced in hero img src
