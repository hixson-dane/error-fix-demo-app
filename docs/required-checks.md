# Required Status Checks for Branch `main`

This document lists the exact check names that must be configured as **required status
checks** in the GitHub branch protection / ruleset for `main`, and explains the recommended
branch rules.

---

## Required status check names

Add each of the following check names in **Settings → Branches → Branch protection rules →
Require status checks to pass before merging** (or the equivalent Ruleset setting):

| Check name | Workflow file | What it enforces |
|------------|--------------|-----------------|
| `analyze` | `.github/workflows/codeql.yml` | CodeQL SAST — finds injection, auth bugs, and other OWASP-relevant code issues in JavaScript |
| `dependency-review` | `.github/workflows/security-gate.yml` | Blocks PRs that introduce dependencies with known high/critical CVEs |
| `secret-scan` | `.github/workflows/security-gate.yml` | Gitleaks — detects accidentally committed secrets/credentials |
| `npm-audit` | `.github/workflows/security-gate.yml` | Fails if any dependency has a high or critical severity vulnerability |
| `quality` | `.github/workflows/quality-gate.yml` | Verifies `npm ci` succeeds, lint passes (if configured), and all tests pass |

> **Tip**: Check names must match *exactly* (case-sensitive) the `name:` field of the job
> in the workflow YAML.

---

## How to configure required checks in the GitHub UI

### Option A — Branch protection rules (classic)

1. Go to **Settings → Branches**.
2. Click **Add rule** (or edit an existing rule for `main`).
3. Set **Branch name pattern** to `main`.
4. Enable **Require a pull request before merging**.
5. Enable **Require status checks to pass before merging**.
6. In the search box that appears, type each check name from the table above and select it.
7. Enable **Require branches to be up to date before merging** (recommended).
8. Click **Save changes**.

### Option B — Repository rulesets (recommended for new repos)

1. Go to **Settings → Rules → Rulesets**.
2. Click **New ruleset → New branch ruleset**.
3. Set **Ruleset name** (e.g., `main protection`).
4. Set **Target branches** to include `main`.
5. Under **Required checks**, add each check name from the table above.
6. Enable **Require a pull request** and set the desired minimum approving reviews (≥ 1
   recommended).
7. Enable **Require code scanning results** if GitHub Advanced Security is enabled.
8. Click **Create**.

---

## Recommended branch protection settings

| Setting | Recommended value | Reason |
|---------|------------------|--------|
| Require pull request before merging | ✅ Enabled | Prevents direct pushes to `main` |
| Required approving reviews | 1 | Ensures a human reviews every change |
| Dismiss stale reviews on new commits | ✅ Enabled | Re-review after changes |
| Require review from Code Owners | Optional | If CODEOWNERS is defined |
| Require status checks to pass | ✅ Enabled | All checks in the table above |
| Require branches to be up to date | ✅ Enabled | Prevents stale-branch merges |
| Require conversation resolution | ✅ Enabled | Ensures all review comments are addressed |
| Restrict who can push to matching branches | Optional | Limit to maintainers for extra protection |
| Allow force pushes | ❌ Disabled | Protects commit history |
| Allow deletions | ❌ Disabled | Prevents accidental branch deletion |

---

## Copilot advisory reviews

Copilot reviews are **not** a required status check. They are advisory and run automatically
when Copilot is added as a reviewer on a PR. Guidelines for what Copilot reviews are
defined in `.github/copilot-instructions.md`.

To request Copilot review on every PR automatically, you can add `@copilot` to a
`CODEOWNERS` file (once that feature is generally available), or simply encourage
contributors to add Copilot as a reviewer manually.

---

## Workflow permissions summary

All workflows follow the principle of least privilege:

| Workflow | Permissions granted |
|----------|-------------------|
| `codeql.yml` | `contents: read`, `security-events: write` |
| `security-gate.yml` | `contents: read` (global); `pull-requests: write` for dependency-review job only |
| `quality-gate.yml` | `contents: read` |
