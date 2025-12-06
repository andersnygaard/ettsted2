# 144-BUG: /settings Route Redirects to Homepage

## Summary
Navigating to /settings shows the homepage/landing page instead of a settings page. Either the route doesn't exist or it incorrectly redirects.

## Context
Screenshot of /settings shows:
- Full landing page with "Ta kontroll over din økonomi" hero
- Feature cards and CTA section
- No settings UI visible

The user avatar in header suggests there should be a settings/profile page accessible.

## Acceptance Criteria
- [ ] /settings route exists and renders settings page
- [ ] Settings page accessible from user avatar dropdown
- [ ] Settings page includes profile editing
- [ ] Settings page includes account management

## Technical Approach
1. Check routes/index.tsx for /settings route definition
2. If missing, create SettingsPage component
3. Add route and link from user avatar menu
4. Include user profile editing functionality

## Files to Investigate
- [routes/index.tsx](frontend/src/routes/index.tsx)
- [AppHeader.tsx](frontend/src/shared/components/AppHeader.tsx)
- Create new SettingsPage if needed

## Priority
Medium

## Effort
Medium (3-4 hours)

## Labels
bug, routing, feature-gap
