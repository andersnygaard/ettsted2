# Feature: Header Menu for Authenticated Users

**Status**: In Progress
**Created**: 2025-11-23
**Priority**: Medium
**Labels**: frontend, navigation, auth
**Reporter**: User

## Problem Statement

Logged-in users need a persistent header with navigation and logout functionality across all protected pages.

## Acceptance Criteria

- [x] Header visible on all routes (protected + public calculators)
- [x] "Hjem" + "Kalkulatorer" links always visible
- [x] "Hjem" navigates to `/dashboard`, "Kalkulatorer" to calculator route
- [x] URL-based active state for current page
- [x] **Desktop**: User avatar in top-right, opens dropdown with "Logg ut"
- [x] **Mobile**: Hamburger menu reveals avatar + logout button
- [x] Avatar from `/.auth/me` with fallbacks: user initials → generic icon
- [x] Loading skeleton while fetching user data (no flash)
- [x] Smooth transitions for dropdown/hamburger
- [x] Logout redirects to `/.auth/logout`
- [x] Remove redundant UserInfo from DashboardPage

## Proposed Layout

### Desktop
```
| Hjem | Kalkulatorer |              | [Avatar v] |
| LEFT                 |              |   RIGHT    |
                                        └─ Logg ut
```

### Mobile
```
| [☰] Hjem | Kalkulatorer |
     └─ [Avatar]
        Logg ut
```

## Affected Components

### Frontend
- **New**: `src/components/Layout.tsx` - Header + content wrapper
- **Modify**: `src/App.tsx` - Wrap protected routes with Layout
- **Modify**: `src/features/dashboard/DashboardPage.tsx` - Remove UserInfo

## Architecture Context

**Current Flow**:
- Each protected page renders independently
- UserInfo with logout only on DashboardPage

**New Flow**:
- Layout wraps all protected routes
- Header with nav + avatar dropdown on all protected pages
- Consistent navigation experience

## Code References

### Current Protected Routes
```tsx
// File: src/App.tsx
<Route path="/dashboard" element={<ProtectedRoute element={<DashboardPage />} />} />
<Route path="/calculator" element={<ProtectedRoute element={<CalculatorPage />} />} />
```

## Proposed Solution Direction

1. Create `Layout.tsx`:
   - Fetch user from `/.auth/me` for avatar
   - Header with "Hjem" + "Kalkulatorer" links, hamburger (mobile)
   - Avatar with fallbacks: photo → initials → generic icon
   - Loading skeleton while fetching user
   - Smooth CSS transitions
   - Children prop for page content
   - BeerCSS styling + responsive

2. Update `App.tsx`:
   - Wrap all route elements with `<Layout>` (protected + public calculators)

3. Clean up `DashboardPage.tsx`:
   - Remove UserInfo import and usage

**Estimated Complexity**: Medium

## Implementation Details

### Avatar Fallback Logic
1. Try user photo URL from `/.auth/me`
2. If missing/error: Extract initials from user name (e.g., "Anders Nygaard" → "AN")
3. If no name: Generic person icon

### Smooth Transitions
- Dropdown/hamburger: fade + slide (200ms ease)
- Loading skeleton: pulse animation

---

## Implementation Plan

**Approach**: Create reusable Layout component with responsive header that wraps all routes. Fetch user data once in Layout, implement mobile-first design with hamburger menu, use BeerCSS for styling.

**Files to create**:
- `src/components/Layout.tsx` - Header with nav links, avatar dropdown, user fetch logic

**Files to modify**:
- `src/App.tsx` - Wrap route elements with Layout component
- `src/features/dashboard/DashboardPage.tsx` - Remove UserInfo component usage

**Dependencies**: None

**Estimated effort**: 1-2 hours

---

## Progress Log
- 2025-11-24 - Started implementation, reviewed existing auth patterns in UserInfo.tsx
- 2025-11-24 - Created Layout.tsx with responsive header, avatar dropdown, hamburger menu
- 2025-11-24 - Updated App.tsx to wrap routes with Layout component
- 2025-11-24 - Removed UserInfo from DashboardPage.tsx
- 2025-11-24 - Build passed successfully

---

## Resolution

Successfully implemented header menu with navigation and logout functionality. All acceptance criteria met.

**Changes made**:
- Created `src/components/Layout.tsx` - Responsive header with:
  - "Hjem" and "Kalkulatorer" navigation links (always visible)
  - URL-based active state styling
  - Desktop: Avatar dropdown with user info + logout
  - Mobile: Hamburger menu revealing avatar + logout button
  - User data fetched from `/.auth/me` with avatar fallbacks (photo → initials → icon)
  - Loading skeleton with pulse animation (no flash)
  - Smooth CSS transitions (200ms fade + slide)
- Updated `src/App.tsx` - Wrapped dashboard and calculator routes with Layout
- Updated `src/features/dashboard/DashboardPage.tsx` - Removed redundant UserInfo component

**Verification**:
- Build passes (`npm run build`)
- All 11 acceptance criteria met
- Responsive design implemented (mobile-first with media queries)
- Smooth animations and transitions working
