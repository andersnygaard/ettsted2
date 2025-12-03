# 118 - Feature: Terms and Privacy Dialog

**Type**: FEATURE
**Priority**: Low
**Effort**: Small (2-3 hours)
**Labels**: frontend, ui, auth, legal

---

## Context

Login flow displays "Ved å logge inn godtar du våre vilkår og personvernregler" text in both LoginModal and LoginPage. Currently static text - should be clickable to open a dialog showing terms of service and privacy policy.

---

## Acceptance Criteria

- [x] Text is clickable (styled as link)
- [x] Clicking opens a modal/dialog
- [x] Dialog contains two tabs or sections: Vilkår (Terms) and Personvern (Privacy)
- [x] Content is readable and scrollable
- [x] Dialog can be closed via X button or clicking outside
- [x] Works in both LoginModal and LoginPage
- [x] Follows Nordic Minimal design system

---

## Technical Approach

### 1. Create TermsDialog Component

```tsx
// frontend/src/features/auth/TermsDialog.tsx
import { useState } from 'react';
import './TermsDialog.css';

interface TermsDialogProps {
  isOpen: boolean;
  onClose: () => void;
  initialTab?: 'terms' | 'privacy';
}

export function TermsDialog({ isOpen, onClose, initialTab = 'terms' }: TermsDialogProps) {
  const [activeTab, setActiveTab] = useState(initialTab);

  if (!isOpen) return null;

  return (
    <div className="terms-dialog-overlay" onClick={onClose}>
      <div className="terms-dialog" onClick={(e) => e.stopPropagation()}>
        <button className="terms-dialog__close" onClick={onClose}>×</button>

        <div className="terms-dialog__tabs">
          <button
            className={`terms-dialog__tab ${activeTab === 'terms' ? 'active' : ''}`}
            onClick={() => setActiveTab('terms')}
          >
            Vilkår
          </button>
          <button
            className={`terms-dialog__tab ${activeTab === 'privacy' ? 'active' : ''}`}
            onClick={() => setActiveTab('privacy')}
          >
            Personvern
          </button>
        </div>

        <div className="terms-dialog__content">
          {activeTab === 'terms' ? <TermsContent /> : <PrivacyContent />}
        </div>
      </div>
    </div>
  );
}

function TermsContent() {
  return (
    <div className="terms-content">
      <h2>Vilkår for bruk</h2>
      <p>Sist oppdatert: [dato]</p>

      <h3>1. Aksept av vilkår</h3>
      <p>Ved å bruke Finans godtar du disse vilkårene...</p>

      <h3>2. Beskrivelse av tjenesten</h3>
      <p>Finans er et verktøy for portefølje- og formuessporing...</p>

      <h3>3. Brukerens ansvar</h3>
      <p>Du er ansvarlig for nøyaktigheten av data du legger inn...</p>

      <h3>4. Ansvarsfraskrivelse</h3>
      <p>Finans gir ikke finansiell rådgivning...</p>

      {/* Add more sections as needed */}
    </div>
  );
}

function PrivacyContent() {
  return (
    <div className="privacy-content">
      <h2>Personvernerklæring</h2>
      <p>Sist oppdatert: [dato]</p>

      <h3>1. Hvilke data samler vi inn</h3>
      <p>Vi samler inn: e-post, navn, og finansdata du legger inn...</p>

      <h3>2. Hvordan bruker vi dataene</h3>
      <p>Dataene brukes kun til å levere tjenesten...</p>

      <h3>3. Lagring og sikkerhet</h3>
      <p>Data lagres kryptert i Azure CosmosDB...</p>

      <h3>4. Dine rettigheter</h3>
      <p>Du kan eksportere og slette alle dine data...</p>

      <h3>5. Kontakt</h3>
      <p>Ved spørsmål, kontakt...</p>

      {/* Add more sections as needed */}
    </div>
  );
}
```

### 2. Update LoginModal

```tsx
// frontend/src/features/auth/LoginModal.tsx
// Add state and handler:
const [showTerms, setShowTerms] = useState(false);

// Update terms text to be clickable:
<p className="login-modal__terms">
  Ved å logge inn godtar du våre{' '}
  <button
    type="button"
    className="login-modal__terms-link"
    onClick={() => setShowTerms(true)}
  >
    vilkår og personvernregler
  </button>
</p>

<TermsDialog isOpen={showTerms} onClose={() => setShowTerms(false)} />
```

### 3. Update LoginPage

Same pattern as LoginModal.

### 4. Add Styles

```css
/* frontend/src/features/auth/TermsDialog.css */
.terms-dialog-overlay {
  position: fixed;
  inset: 0;
  background: rgba(44, 44, 44, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.terms-dialog {
  background: var(--warm-white);
  border-radius: 2px;
  max-width: 600px;
  max-height: 80vh;
  width: 90%;
  display: flex;
  flex-direction: column;
}

.terms-dialog__close {
  position: absolute;
  top: 16px;
  right: 16px;
  /* ... */
}

.terms-dialog__tabs {
  display: flex;
  border-bottom: 1px solid var(--border);
}

.terms-dialog__tab {
  padding: 16px 24px;
  background: none;
  border: none;
  cursor: pointer;
  font-family: 'DM Sans', sans-serif;
}

.terms-dialog__tab.active {
  border-bottom: 2px solid var(--charcoal);
}

.terms-dialog__content {
  padding: 24px;
  overflow-y: auto;
  flex: 1;
}

.login-modal__terms-link {
  background: none;
  border: none;
  color: var(--text-secondary);
  text-decoration: underline;
  cursor: pointer;
  font: inherit;
}

.login-modal__terms-link:hover {
  color: var(--charcoal);
}
```

---

## Files to Create

- [frontend/src/features/auth/TermsDialog.tsx](frontend/src/features/auth/TermsDialog.tsx)
- [frontend/src/features/auth/TermsDialog.css](frontend/src/features/auth/TermsDialog.css)

## Files to Modify

- [frontend/src/features/auth/LoginModal.tsx](frontend/src/features/auth/LoginModal.tsx) - Add dialog trigger
- [frontend/src/features/auth/LoginPage.tsx](frontend/src/features/auth/LoginPage.tsx) - Add dialog trigger
- [frontend/src/features/auth/LoginModal.css](frontend/src/features/auth/LoginModal.css) - Add link styles

---

## Dependencies

None - standalone feature.

---

## Notes

- Terms and privacy content is placeholder - should be reviewed and finalized
- Consider extracting content to separate files or CMS if frequent updates needed
- May need legal review before production

---

## Verification

1. Navigate to login page
2. Click "vilkår og personvernregler" link
3. Verify dialog opens with tabs
4. Switch between Vilkår and Personvern tabs
5. Scroll content if long
6. Close via X button
7. Close by clicking outside
8. Repeat test in LoginModal (when not logged in)

---

## Implementation Complete

**Status**: COMPLETED

**Files Created**:
- `frontend/src/features/auth/TermsDialog.tsx` - Component with tabbed interface and placeholder content
- `frontend/src/features/auth/TermsDialog.css` - Nordic Minimal styling with responsive design

**Files Modified**:
- `frontend/src/features/auth/LoginModal.tsx` - Added state and dialog trigger
- `frontend/src/features/auth/LoginPage.tsx` - Added state and dialog trigger

**Verification**:
- TypeScript builds successfully (zero errors)
- All acceptance criteria met
- Design tokens and CSS variables used consistently
- Responsive design included
- Accessibility features implemented (close button labels, focus styles)
