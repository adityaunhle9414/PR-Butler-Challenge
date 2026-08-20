---
name: impact-reviewer
description: "Use when: reviewing new changes for functional impact, showstopper risks, database impact, regression risk, coding standards, query or code optimization, performance issues, iterative errors, or design compatibility."
---

## Overview

The Impact Reviewer performs a risk-focused review of new changes before merge. It identifies whether a change can break existing functionality, introduce showstopper issues, affect database compatibility, violate coding standards, degrade performance, or create repetitive/iterative errors.

Use this skill after implementation and before final PR approval. The output should be direct, evidence-based, and ordered by severity.

## Instructions

### Step 1: Establish Review Scope

1. Determine the review target from the user request:
   - Current working tree
   - Staged changes
   - Branch comparison
   - Commit range
   - Specific files or modules
2. If no scope is specified, inspect `git status --short`, `git diff --stat`, and the relevant diffs.
3. Identify changed entry points, public APIs, database objects, UI workflows, tests, config, and generated artifacts.
4. Preserve user work. Do not revert or modify files unless the user explicitly asks for fixes.

Output for this step: review scope, changed files, and high-risk areas.

### Step 2: Functional Impact Review

Check whether new changes alter or break existing behavior:

1. Identify affected user workflows and existing acceptance criteria.
2. Trace inputs, state changes, side effects, persistence, outputs, and error paths.
3. Compare old behavior and new behavior where possible.
4. Look for missing validation, null/undefined access, bad defaults, race conditions, state leaks, permission bypasses, and incomplete error handling.
5. Verify backward compatibility for users, integrations, saved data, and configuration.

Classify each issue:

- Showstopper: blocks release or can break critical user paths, data integrity, security, or production startup.
- High: likely regression or serious workflow impact.
- Medium: behavior risk with workaround or limited blast radius.
- Low: minor maintainability or polish issue.

Output for this step: functional impact findings with file references, severity, and recommended action.

### Step 3: Database And Data Compatibility Review

Run this step whenever database, schema, migration, persistence, ORM model, query, seed data, cache, or serialized storage changes are observed.

Check:

1. Database field additions, removals, renames, type changes, default values, nullability, uniqueness, indexes, constraints, and relationships.
2. Migration safety:
   - Backward compatible deployment
   - Rollback path
   - Existing data conversion
   - Locking or long-running migration risk
   - Multi-version app compatibility
3. Query correctness and performance:
   - Missing filters
   - N+1 query patterns
   - Full table scans
   - Missing indexes
   - Incorrect joins
   - Pagination gaps
   - Over-fetching
4. Data integrity:
   - Orphan records
   - Duplicate rows
   - Partial writes
   - Transaction boundaries
   - Idempotency
5. Existing functionality and UI design that depends on old fields or relationships.

If no database or persistence changes are present, explicitly state `No database-level changes observed`.

Output for this step: database impact findings, migration risk, and optimization recommendations.

### Step 4: Coding Standards And Maintainability Review

Assess whether the change follows the repository's current style and standards:

1. Read nearby code before judging style.
2. Check naming, typing, module boundaries, formatting, error handling, logging, comments, and test style.
3. Identify unused variables, dead code, duplicated logic, overly complex functions, and avoidable abstractions.
4. Check that public APIs are typed and documented where the repository expects documentation.
5. Check that generated files, build outputs, coverage reports, and dependency churn are not accidentally committed.
6. Run available validation commands when appropriate:
   - Build or typecheck
   - Unit tests
   - Coverage
   - Lint
   - Format check

Output for this step: standards findings and command results.

### Step 5: Optimization Review

Review code and query efficiency without over-optimizing small changes.

Check:

1. Repeated loops, unnecessary renders, expensive operations in hot paths, avoidable network calls, memory leaks, stale event listeners, and unbounded storage growth.
2. Query plans and indexes when SQL or ORM changes are present.
3. API payload sizes, pagination, caching, batching, and retry behavior.
4. Frontend performance: unnecessary DOM churn, layout shifts, large assets, blocking operations, and repeated state recalculation.
5. Whether the optimization is needed now or should be tracked as follow-up.

Output for this step: optimization opportunities ranked by impact and confidence.

### Step 6: Iterative Error And Regression Pattern Review

Identify flaws that can cause repeated failures, loops, or fragile behavior:

1. Infinite loops or repeated event binding.
2. Retry loops without backoff or stop conditions.
3. Repeated database writes from render paths or watchers.
4. State updates triggered by derived state in a loop.
5. Non-idempotent migrations or scripts.
6. Test pollution from shared global state, localStorage, timers, mocks, or database records.
7. Flaky async timing, unawaited promises, and missing cleanup.

Output for this step: iterative error risks and concrete mitigation.

### Step 7: Produce Review Report

Write the final report in code-review style:

1. Findings first, ordered by severity.
2. Use concrete file references and explain the failure mode.
3. Include why it matters and the recommended fix.
4. Separate confirmed issues from assumptions or questions.
5. Include a quality-gate summary with commands run and results.
6. If no showstoppers are found, say so clearly.

Use this format:

```markdown
## Impact Review

### Showstoppers

### High Risk

### Medium Risk

### Low Risk

### Database Impact

### Coding Standards

### Optimization Notes

### Iterative Error Risks

### Quality Gates

### Open Questions

### Overall Decision
```

Overall decision must be one of:

- Block: showstopper or high-risk issue must be fixed before merge.
- Needs changes: non-blocking issues should be fixed before approval.
- Approve with notes: low-risk issues or follow-ups only.
- No issues found: no material risk found in reviewed scope.

## Examples

### Example 1: Showstopper Found

**Input:** "Use impact-reviewer for this PR"

**Expected output:**

```text
Overall decision: Block
Showstopper: Migration removes required customer.email without a backfill or compatibility layer.
Impact: Existing login and notification flows can fail for existing users.
Recommended fix: Add a two-phase migration and update readers before dropping the column.
```

### Example 2: No Database Changes

**Input:** "Review the current frontend diff for impact"

**Expected output:**

```text
Overall decision: Approve with notes
No showstoppers found.
No database-level changes observed.
One medium risk: repeated event listener registration can duplicate submit handling after re-initialization.
Quality gates: build and tests passed.
```

## Success Criteria

- [ ] Review scope is explicit.
- [ ] Showstopper risks are identified or explicitly ruled out.
- [ ] Functional impact is assessed against existing behavior.
- [ ] Database-level changes are reviewed or explicitly marked absent.
- [ ] Previous functionality and design compatibility are considered.
- [ ] Coding standards are checked against local conventions.
- [ ] Code/query optimization risks are assessed.
- [ ] Iterative error and regression patterns are assessed.
- [ ] Quality gates and commands are reported.
- [ ] Final decision is clear: Block, Needs changes, Approve with notes, or No issues found.
