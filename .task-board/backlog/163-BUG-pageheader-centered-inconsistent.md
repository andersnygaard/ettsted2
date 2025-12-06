# 149-BUG: PageHeader Centered Prop Used Inconsistently

## Summary
The PageHeader component has a `centered` prop that's used inconsistently across pages. Some pages center their headers, others don't, with no clear pattern.

## Context
Usage analysis:
- CalculatorsPage: `<PageHeader centered />`
- SparingPage: `<PageHeader />` (not centered)
- GjeldPage: `<PageHeader />` (not centered)
- DashboardPage: `<PageHeader />` (not centered)

Design drafts should define which pages should have centered headers.

## Acceptance Criteria
- [ ] Document design decision: which pages should be centered
- [ ] Apply consistent pattern across all pages
- [ ] Consider if `centered` should be the default

## Technical Approach
1. Review design drafts for header alignment
2. Apply consistent pattern
3. Consider updating PageHeader default behavior

## Files to Investigate
- All *Page.tsx files
- Design drafts in .docs/design-drafts/

## Priority
Low

## Effort
Simple (1 hour)

## Labels
bug, design, consistency
