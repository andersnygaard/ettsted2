---
description: 'Guidelines for GitHub Copilot to write comments to achieve self-explanatory code with less comments. Examples are in JavaScript but it should work on any language that has comments.'
applyTo: '**'
---

# Self-explanatory Code Commenting Instructions

## Core Principle
Write code that speaks for itself. Comment only to explain WHY, not WHAT.

## When TO Comment

### Complex Business Logic
```javascript
// Apply progressive tax brackets: 10% up to 10k, 20% above
const tax = calculateProgressiveTax(income, [0.10, 0.20], [10000]);
```

### Algorithm Choices
```javascript
// Using Floyd-Warshall because we need distances between all nodes
for (let k = 0; k < vertices; k++) { /* ... */ }
```

### Regex Patterns
```javascript
// Match email format: username@domain.extension
const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
```

### API Constraints
```javascript
// GitHub API rate limit: 5000 requests/hour for authenticated users
await rateLimiter.wait();
```

### Public APIs
```javascript
/**
 * @param {number} rate - Annual interest rate (as decimal, e.g., 0.05 for 5%)
 */
function calculateCompoundInterest(principal, rate, time) { /* ... */ }
```

### Annotations
- `// TODO:` for planned improvements
- `// FIXME:` for known bugs
- `// HACK:` for temporary workarounds
- `// PERF:` for performance considerations
- `// SECURITY:` for security implications

## Decision Framework
1. Is the code self-explanatory? → No comment needed
2. Would a better name eliminate the need? → Refactor instead
3. Does this explain WHY, not WHAT? → Good comment
4. Will this help future maintainers? → Good comment