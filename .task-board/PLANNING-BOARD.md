# Planning Board - Finans

**Current Focus**: Placeholder Pages + Design Foundation

---

## Top Priorities

### 1. Design Tokens & Typography (Effort: Quick - 1-2 timer)
**Files**: `021-FEATURE-design-tokens.md`, `022-FEATURE-typography-setup.md`
**Why Now**: Grunnlag for all styling - må på plass først
**Status**: Ready

### 2. App Header & Layout (Effort: Quick - 1-2 timer)
**Files**: `025-FEATURE-app-header.md`, `068-FEATURE-update-layout.md`
**Why Now**: Navigation er synlig på alle sider
**Status**: Ready (avhenger av design tokens)

### 3. Portfolio Page - Placeholder (Effort: Quick - 1 time)
**File**: `041-FEATURE-portfolio-page.md`
**Why Now**: Hovedside for dataregistrering
**Status**: Ready - kan bygges med placeholder-data

### 4. Kalkulatorer Page - Placeholder (Effort: Quick - 1 time)
**File**: `059-FEATURE-kalkulatorer-page.md`
**Why Now**: Viktig funksjon, enkel side med 4 kort
**Status**: Ready

### 5. Sparing/Gjeld/Pensjon Pages - Placeholders (Effort: Quick - 2 timer)
**Files**: `049-FEATURE-sparing-page.md`, `053-FEATURE-gjeld-page.md`, `057-FEATURE-pensjon-page.md`
**Why Now**: Komplett navigasjon
**Status**: Ready

---

## Task Categories

### ✅ Ferdig (9 oppgaver)
- 001-008: Backend infrastruktur, frontend init, user auth, portfolio API
- 009: Dashboard/Oversikt page (placeholder)

### 📋 Backlog - Infrastruktur (3 oppgaver, lav prioritet)
- 013: Validation framework refactor
- 014: Error handling refactor
- 015: CI/CD workflows

### 📋 Backlog - Design System (4 oppgaver)
- 021: Design tokens
- 022: Typography setup
- 023: Grain texture overlay
- 024: Animation utilities

### 📋 Backlog - Komponenter (30+ oppgaver)
- 025-036: Core UI components
- 038-045: Table & form components
- 046-058: Feature-specific components
- 069-070: Container, loading skeleton

### 📋 Backlog - Sider (6 oppgaver)
- 041: Portfolio page
- 049: Sparing page
- 053: Gjeld page
- 057: Pensjon page
- 059: Kalkulatorer page
- 060-063: Calculator sub-pages

### 📋 Backlog - Data Integration (4 oppgaver)
- 064: Monte Carlo backend
- 065-066: Data hooks
- 067: Update routes

### ⏸️ On-Hold (3 oppgaver)
- 016: LLM Data Import (avansert)
- 017: Playwright E2E tests (etter MVP)
- 019: Storybook setup (dokumentasjon)

---

## Recently Completed

### ✅ 009-FEATURE-portfolio-dashboard (2025-11-29)
Placeholder Dashboard med Nordic Minimal design - hero number, quick stats, milestone, section links

### ✅ 008-FEATURE-portfolio-api-endpoints (2025-11-29)
Komplett Portfolio API med 9 REST endpoints

### ✅ 001-007 (2025-11-28/29)
Backend server, CosmosDB, frontend init, localization, auth middleware, user API, auth UI

---

## Slettet/Erstattet

Følgende gamle oppgaver ble slettet (erstattet av nyere, mer detaljerte oppgaver):
- ~~010~~: Portfolio Tracker UI → Erstattet av 041 + 042
- ~~011~~: Compound Calculator → Erstattet av 060
- ~~012~~: Monte Carlo Simulator → Erstattet av 063 + 064
- ~~018~~: Component Library → Erstattet av 021-036
- ~~020~~: Asset Allocation Chart → Ikke i design-skisser
- ~~037~~: Oversikt Page → Duplikat av 009

---

**Last Updated**: 2025-11-29

**Statistics**:
- Ferdig: 9
- Backlog: 50
- On-Hold: 3
- In Progress: 0

**Approach**: Bygg placeholder-sider først med hardkodet data, deretter legg til ekte komponenter og API-integrasjon.
