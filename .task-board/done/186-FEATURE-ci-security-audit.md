# 186-FEATURE: Add Security Audit to CI Pipeline

## Context

The CI pipeline ([ci.yml](.github/workflows/ci.yml)) runs lint, type-check, and build but does not include security vulnerability scanning. Adding `pnpm audit` to CI will catch vulnerable dependencies before they reach production.

**Current state**: No security scanning in CI
**npm audit results**: 2 moderate vulnerabilities in esbuild (dev dependency)

## Type

FEATURE

## Priority

Medium - Security best practice, low effort, high value

## Acceptance Criteria

- [x] CI workflow includes `pnpm audit` step
- [x] Audit runs after dependency installation
- [x] Build fails on HIGH or CRITICAL vulnerabilities
- [x] Moderate/Low vulnerabilities logged as warnings (don't fail build)

## Technical Approach

Add audit step to [ci.yml](.github/workflows/ci.yml):

```yaml
- name: Security audit
  run: pnpm audit --audit-level=high
```

The `--audit-level=high` flag ensures only HIGH/CRITICAL fail the build. Moderate/low are informational.

## Files to Modify

- [.github/workflows/ci.yml](.github/workflows/ci.yml) - Add audit step

## Effort Estimate

Simple - 15 minutes

## Related Plans

- Due diligence report recommends automated security scanning

## Resolution

**Completed**: 2025-12-06

Added `pnpm audit --audit-level=high` step to CI workflow after dependency installation.

**Local verification**:
- 2 moderate vulnerabilities in esbuild (dev-only) - does NOT fail build
- Exit code 0 with `--audit-level=high` (only HIGH/CRITICAL would fail)

**Changes**:
- `.github/workflows/ci.yml` - Added "Security audit" step at line 27-28
