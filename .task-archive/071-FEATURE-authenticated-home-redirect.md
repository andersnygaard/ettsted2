# 071 - FEATURE: Authenticated Home Redirect

## Summary
Make the home route show DashboardPage for logged-in users and HomePage for anonymous users.

## Context
Currently / shows HomePage (public). User expects logo and Oversikt to go to Dashboard when logged in.

## Acceptance Criteria
- [x] Logged-in users see DashboardPage at /
- [x] Anonymous users see HomePage at /
- [x] After login, redirect to /

## Files to Modify
- frontend/src/routes/index.tsx
- frontend/src/features/auth/LoginPage.tsx

## Effort: Simple (30 min)

## Labels: frontend, routing, auth, ux

Created: 2025-11-29 | Status: Complete

## Resolution

Already implemented:
- `HomePageRouter` component in `frontend/src/routes/index.tsx:32-40` conditionally renders DashboardPage or HomePage based on auth state
- LoginPage redirects to `/` via `post_login_redirect_uri=/` parameter

All acceptance criteria verified as complete.
