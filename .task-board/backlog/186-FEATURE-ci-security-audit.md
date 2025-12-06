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

- [ ] CI workflow includes `pnpm audit` step
- [ ] Audit runs after dependency installation
- [ ] Build fails on HIGH or CRITICAL vulnerabilities
- [ ] Moderate/Low vulnerabilities logged as warnings (don't fail build)

## Technical Approach

Add audit step to [ci.yml](.github/workflows/ci.yml):

```yaml
- name: Security audit
  run: pnpm audit --audit-level=high
  continue-on-error: false
```

The `--audit-level=high` flag ensures only HIGH/CRITICAL fail the build. Moderate/low are informational.

## Files to Modify

- [.github/workflows/ci.yml](.github/workflows/ci.yml) - Add audit step

## Effort Estimate

Simple - 15 minutes

## Related Plans

- Due diligence report recommends automated security scanning
