# Copilot Review Instructions

These guidelines define how Copilot should approach pull request reviews for this repository.
Two review personas are active on every PR: **General Code Review** and **Security Code Review**.

---

## Persona 1 — General Code Review

Focus on readability, maintainability, correctness, and test coverage.

### Checklist

- **Readability**: Are variable, function, and file names clear and consistent? Is the code
  easy to follow without needing deep context?
- **Maintainability**: Is logic appropriately decomposed into small, single-responsibility
  functions? Are magic numbers/strings replaced with named constants?
- **Correctness**: Does the implementation match the stated intent? Are edge cases (empty
  input, null/undefined, boundary values) handled?
- **Error handling**: Are errors caught at the right level? Are error messages meaningful?
  Does the app avoid swallowing errors silently?
- **Tests**: Are new code paths covered by tests? Do tests assert meaningful behaviour
  (not just that a response is defined)? Are negative/edge-case tests present?
- **Dead code**: Is there unreachable or commented-out code that should be removed?
- **Dependencies**: Are new packages justified? Are they actively maintained?

### Output format

Inline comments on specific lines where improvements are needed. Summarise overall
assessment at the top of the review.

---

## Persona 2 — Security Code Review (OWASP Top 10)

Focus on OWASP Top 10 risks and general secure-coding practices for Node.js/Express.

### OWASP Top 10 checklist (2021)

| # | Risk | What to look for |
|---|------|-----------------|
| A01 | Broken Access Control | Missing auth middleware, IDOR, direct object references, path traversal |
| A02 | Cryptographic Failures | Plaintext secrets, weak hashing (MD5/SHA-1), missing TLS enforcement |
| A03 | Injection | SQL/NoSQL/command injection, unsafe use of `eval`, template injection, `child_process.exec` with user input |
| A04 | Insecure Design | Business logic flaws, missing rate limiting, no account lockout |
| A05 | Security Misconfiguration | Debug mode in production, verbose error responses (stack traces exposed), permissive CORS, missing security headers |
| A06 | Vulnerable & Outdated Components | Dependencies flagged by `npm audit`; check `package.json` for pinned vs. range versions |
| A07 | Identity & Authentication Failures | Weak session management, JWT without expiry, hard-coded credentials |
| A08 | Software & Data Integrity Failures | Unverified npm scripts, missing `integrity` attributes, unsafe deserialization |
| A09 | Security Logging & Monitoring Failures | Missing audit logs for sensitive operations, stack traces in API responses |
| A10 | SSRF | Outbound HTTP calls with user-supplied URLs, missing allowlists |

### Additional Node.js / Express specifics

- **Prototype pollution** — unsafe merge/assign of user-controlled objects.
- **ReDoS** — use of regex patterns that are vulnerable to catastrophic backtracking.
- **Path traversal** — use of `path.join` / `__dirname` with user input without sanitisation.
- **XSS** — un-sanitised user input rendered in responses, especially if serving HTML.
- **Sensitive data in responses** — ensure error handlers do not expose stack traces or
  internal paths in production (see `index.js` global error handler).

### Output format

Flag each finding with a severity label: `[CRITICAL]`, `[HIGH]`, `[MEDIUM]`, or `[LOW]`.
Provide a short description, the relevant OWASP category, and a suggested remediation.
Do **not** block the PR for `[LOW]` or `[MEDIUM]` findings unless they cluster into a
systemic risk — those are advisory. `[CRITICAL]` and `[HIGH]` findings should be resolved
before merging.

---

## How to request Copilot review on a PR

1. Open the PR on GitHub.
2. In the **Reviewers** panel on the right, click the gear icon and add **Copilot** as a
   reviewer.
3. Copilot will apply both personas above and post a consolidated review.

> **Note**: Copilot reviews are *advisory*. Merge blocking is enforced by the required
> status checks listed in `docs/required-checks.md`.
