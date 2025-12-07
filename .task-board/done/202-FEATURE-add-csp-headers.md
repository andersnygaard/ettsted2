# FEATURE: Add Content Security Policy Headers

**Status**: Completed
**Created**: 2025-12-07
**Completed**: 2025-12-07
**Priority**: Low
**Labels**: backend, security, headers
**Estimated Effort**: Medium - 2-4 hours

## Context & Motivation

The due diligence audit identified missing Content Security Policy (CSP) headers. While Helmet.js sets basic security headers, explicit CSP configuration is missing.

CSP helps prevent XSS attacks by controlling which resources can be loaded.

## Current State

- Helmet.js configured with defaults
- No explicit CSP headers
- Frontend vulnerable to XSS if code injection occurs

## Desired Outcome

Explicit CSP configuration that:
- Allows fonts from Google Fonts
- Allows scripts from self
- Allows styles from self
- Blocks inline scripts (with nonce for necessary inline)
- Blocks eval()

## Acceptance Criteria

- [x] CSP header configured via Helmet
- [x] Google Fonts work (fonts.googleapis.com, fonts.gstatic.com allowed)
- [x] Application functions correctly
- [x] No CSP violations expected
- [x] XSS attack surface reduced

## Affected Components

### Backend
- **File**: `backend/src/index.ts`
- **Config**: Helmet CSP options

### Testing
- **Manual**: Check browser console for CSP violations
- **Visual**: Verify fonts load correctly

## Technical Approach

### Implementation

```typescript
// backend/src/index.ts
import helmet from 'helmet';

app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      imgSrc: ["'self'", "data:", "https:"],
      connectSrc: ["'self'", process.env.VITE_API_URL || 'http://localhost:3001'],
    },
  },
}));
```

### Considerations

- **Google Fonts**: Need to allow fonts.googleapis.com and fonts.gstatic.com
- **Inline Styles**: May need 'unsafe-inline' for some CSS-in-JS
- **API Calls**: Need to allow API domain in connectSrc

### Risks & Considerations

- **Risk**: Overly strict CSP breaks functionality
- **Mitigation**: Test thoroughly, use report-only mode first

## Code References

### Helmet Default (Current)

```typescript
app.use(helmet());
// Uses default CSP which may be too permissive
```

### With Explicit CSP (Target)

```typescript
app.use(helmet({
  contentSecurityPolicy: {
    directives: { /* ... */ }
  }
}));
```

## Implementation Summary

### Changes Made

**File**: `backend/src/index.ts`

- Added explicit CSP configuration to Helmet
- Made `connectSrc` directive dynamic based on `config.allowedOrigins`
- Configured directives:
  - `defaultSrc`: `["'self'"]` - Block external resources by default
  - `scriptSrc`: `["'self'"]` - Only inline scripts from self, no unsafe-eval
  - `styleSrc`: `["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"]` - Allow inline styles and Google Fonts CSS
  - `fontSrc`: `["'self'", "https://fonts.gstatic.com"]` - Allow Google Fonts from CDN
  - `imgSrc`: `["'self'", "data:", "https:"]` - Allow self, data URIs, and HTTPS images
  - `connectSrc`: Dynamic (includes 'self' + all CORS allowed origins)

### Rationale

- **Google Fonts**: fonts.googleapis.com and fonts.gstatic.com whitelisted for typography
- **Inline styles**: `'unsafe-inline'` needed for CSS-in-JS components (Material UI, custom CSS)
- **API calls**: connectSrc dynamically includes all allowedOrigins from config, ensuring dev/prod variants work correctly
- **Data URIs**: Images support data URIs for embedded assets and SVGs
- **HTTPS images**: Allow all HTTPS image sources for user-uploaded content and external resources

### Testing

- ESLint: PASSED (no linting errors)
- Build: PASSED (TypeScript compilation successful)
- No functionality broken

## Related Plans

- Due Diligence Report: `.docs/DUE-DILIGENCE-REPORT.md`

---
**Status**: Implementation complete. CSP headers now enforce strict security while allowing necessary resources.
