# 177-REFACTOR: Consolidate Settings and Economy Pages

## Summary
Delete SettingsPage (Innstillinger) - it duplicates functionality already in EconomyPage (Min Økonomi). Keep single config location using OnboardingWizard.

## Priority
MEDIUM

## Effort
Simple

## Context
Two overlapping pages exist:
- **SettingsPage** (`/settings`): Profile display + economic settings edit + link to /economy
- **EconomyPage** (`/economy`): Full OnboardingWizard in edit mode (profile + accounts)

SettingsPage was added recently but Min Økonomi (OnboardingWizard) already handles all user configuration. Having two dialogs is confusing and redundant.

## File Locations
- DELETE: [frontend/src/features/settings/SettingsPage.tsx](frontend/src/features/settings/SettingsPage.tsx)
- DELETE: [frontend/src/features/settings/SettingsPage.css](frontend/src/features/settings/SettingsPage.css)
- KEEP: [frontend/src/features/auth/EconomyPage.tsx](frontend/src/features/auth/EconomyPage.tsx)
- UPDATE: [frontend/src/routes/index.tsx](frontend/src/routes/index.tsx) - remove /settings route
- UPDATE: [frontend/src/shared/components/AvatarMenu.tsx](frontend/src/shared/components/AvatarMenu.tsx) - update menu links

## Acceptance Criteria
- [x] Delete SettingsPage and its CSS
- [x] Remove /settings route
- [x] AvatarMenu links directly to /economy ("Min Økonomi")
- [x] OnboardingWizard edit mode shows user profile info at top (email, name)
- [x] No broken links or references to /settings

## Completion Status
COMPLETED - Frontend build successful, no compilation errors

## Technical Approach
1. Delete `frontend/src/features/settings/` folder
2. Update routes to remove /settings
3. Update AvatarMenu to use /economy
4. Optionally enhance EconomyPage to show read-only profile info (email, user ID)
