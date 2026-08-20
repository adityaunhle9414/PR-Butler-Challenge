---
name: pr-butler
description: "Use when: preparing a PR, running a pre-commit check, fixing the scaffold website, completing translations, cleaning code, adding tests, updating docs, enforcing quality gates, or generating PR deliverables."
---

## Overview

The PR Butler automates the complete pre-commit checklist for the scaffold website in `scaffold/website`. It turns the deliberately flawed task manager app into PR-ready code by fixing translations, cleaning source code, increasing test coverage, updating documentation, enforcing quality gates, and preparing PR deliverables.

Run this Skill from the repository root. Treat `tech_challenge.md` and `scaffold/expected_fixes.json` as the source of truth for expected behavior, but always inspect the current files before editing because the scaffold may already contain partial fixes.

### When to Invoke

- User runs "prepare for PR" or "pre-commit check"
- User asks to "fix the scaffold" or "make this PR-ready"
- User asks to complete the PR Butler challenge deliverables
- User asks to fix missing French translations, code quality, coverage, docs, or PR metadata
- Before any pull request submission

---

## Instructions

### Step 1: Translation Detection & Fix

1. Read `scaffold/website/src/translations/en.json` and `scaffold/website/src/translations/fr.json`.
2. Compare keys from English to French. Do not assume the initial state; compute the missing keys from the current files.
3. Add every missing French value to `fr.json`. Use natural French that matches the English UI meaning:
   - `app.title`: `Mon Gestionnaire de Taches`
   - `task.add`: `Ajouter une Nouvelle Tache`
   - `task.placeholder`: `Saisir la description de la tache`
   - `priority.low`: `Priorite basse`
   - `priority.medium`: `Priorite moyenne`
   - `priority.high`: `Priorite elevee`
   - `button.add`: `Ajouter la tache`
   - `filter.all`: `Toutes les taches`
   - `filter.active`: `Actives`
   - `filter.completed`: `Terminees`
   - `stats.total`: `Total des taches`
   - `stats.completed`: `Terminees`
   - `button.delete`: `Supprimer`
   - `footer.text`: `Cree avec TypeScript`
4. Keep JSON valid, preserve the same key set as `en.json`, and ensure there are exactly 14 French keys unless the English file has changed.
5. Inspect `scaffold/website/index.html`, `scaffold/website/src/main.ts`, and `scaffold/website/src/taskManager.ts` for hardcoded UI strings. Add or preserve translation hooks so switching English/French updates static labels, placeholders, select options, filters, stats labels, footer text, task priority badges, and delete buttons.
6. Re-run the app build after translation wiring changes with `npm run build` from `scaffold/website`.

Output for this step: list missing keys found, keys added, files changed, and whether the language toggle now reapplies translations without page reload.

### Step 2: Code Cleanup

1. Check the working tree before edits with `git status --short`. Preserve user changes and do not revert unrelated files.
2. Format all touched source files consistently with the existing TypeScript style. If a formatter is configured, run it. If no formatter is configured, manually format only the touched files.
3. Fix the deliberately poor `handleSubmit()` formatting in `scaffold/website/src/main.ts`:
   - Proper indentation
   - Spaces around assignments and operators
   - Space before `{`
   - Readable union type formatting for priority values
4. Remove unused variables and unused parameters reported by TypeScript. The project already has `noUnusedLocals` and `noUnusedParameters` enabled in `scaffold/website/tsconfig.json`.
5. Fix local lint-like issues that affect quality or safety:
   - Do not render task text with `innerHTML`; use text assignment for user-entered task text.
   - Remove stale comments that mention internal endpoints, auth tokens, or secrets.
   - Avoid single-letter callback names when they obscure intent or shadow imported helpers.
   - Add basic error handling for asynchronous app initialization.
6. If ESLint or Prettier is already configured, run the configured lint/format commands and fix all auto-fixable issues. If they are not configured, do not add dependency churn unless the user explicitly asks; use `npm run build` as the strict TypeScript quality check.

Output for this step: files formatted, unused variables removed, lint/type issues fixed, and any lint tooling that was unavailable.

### Step 3: Test Automation

1. From `scaffold/website`, run `npm run test` to capture the baseline.
2. Inspect `scaffold/website/src/tests/taskManager.test.ts` and `scaffold/website/src/taskManager.ts`.
3. Add focused Vitest tests for the missing behaviors listed in `scaffold/expected_fixes.json`:
   - `toggleTask()` toggles completion and updates completed count.
   - `deleteTask()` removes the matching task and ignores unknown ids safely.
   - `setFilter()` changes rendered output for `all`, `active`, and `completed`.
   - `render()` creates task DOM nodes, priority badges, delete buttons, and stats.
   - `saveToStorage()` persists task data through public behavior.
   - `loadFromStorage()` restores stored tasks through constructor behavior.
4. Use jsdom DOM setup in tests for `#tasks`, `#total-count`, and `#completed-count`.
5. Clear `localStorage` and reset the DOM between tests to avoid test pollution.
6. Run `npm run test` after adding tests.
7. Run `npm run test:coverage` and iterate until coverage is at least 80% for the project.

Output for this step: baseline test result, tests added, final test result, final coverage percentage, and any remaining uncovered risk.

### Step 4: Documentation Updates

1. Add concise JSDoc/TSDoc comments to public functions required by the challenge:
   - `TaskManager.addTask`
   - `TaskManager.toggleTask`
   - `TaskManager.deleteTask`
   - `TaskManager.setFilter`
   - `TaskManager.render`
   - `TaskManager.getTasks`
   - `TaskManager.getCompletedCount`
   - `init`
   - `setupEventListeners`
   - `handleSubmit`
   - `switchLanguage`
2. Keep comments useful and short. Do not narrate obvious assignments.
3. Update `scaffold/website/README.md` with these sections:
   - Features
   - Testing
   - Contributing
4. Generate `CHANGELOG.md` at the repository root unless one already exists in a more appropriate project location. Summarize translation, cleanup, tests, docs, and quality gate changes.
5. Generate `PR_REQUEST.md` at the repository root unless one already exists in a more appropriate project location. Include:
   - Conventional PR title
   - Summary of changes
   - Test and coverage results
   - Quality gate checklist
   - Files changed
   - Risks or follow-up notes

Output for this step: documented functions count, README sections updated, changelog path, and PR request path.

### Step 5: Quality Gates

Run all quality gates from `scaffold/website` after implementation:

1. `npm run build`
   - Must pass TypeScript strict checks and Vite build.
   - Treat TypeScript errors, unused locals, and unused parameters as failures.
2. `npm run test`
   - Must pass all tests.
3. `npm run test:coverage`
   - Must show coverage >= 80%.
4. If a lint command exists in `package.json`, run it and require zero lint errors.
5. If a format-check command exists in `package.json`, run it and require success.

If any gate fails, stop before Step 6. Report the exact failed command, the failing output summary, and the next corrective action. Do not claim the PR is ready when any gate fails.

Output for this step: command results, coverage percentage, lint status, and pass/fail decision.

### Step 6: PR Preparation

1. Review `git diff --stat` and summarize the final changed files.
2. Finalize `PR_REQUEST.md` with the actual quality metrics from Step 5.
3. Generate a conventional commit message, but do not run `git commit` unless the user explicitly asks. Suggested format:

   ```text
   fix: prepare task manager scaffold for PR
   ```

   Use a longer body if helpful:

   ```text
   - add missing French translations and language toggle wiring
   - clean TypeScript source and remove unsafe task text rendering
   - expand task manager tests above 80% coverage
   - update README, changelog, and PR request documentation
   ```

4. Confirm all deliverables exist:
   - Completed `fr.json`
   - Formatted source files
   - Expanded tests
   - Updated README
   - `CHANGELOG.md`
   - `PR_REQUEST.md`
   - Passing quality gates
   - Conventional commit message

Output for this step: final summary, generated commit message, PR request path, and remaining risks.

---

## Examples

### Example 1: Full PR Preparation

**Input:** "Make the scaffold PR-ready"

**Expected output:**

```
Step 1: PASS - Compared en.json and fr.json, added 12 missing French keys, and wired language switching for static and dynamic UI labels.
Step 2: PASS - Formatted main.ts, removed unused code, replaced unsafe task text rendering, and passed TypeScript strict checks.
Step 3: PASS - Added tests for toggleTask, deleteTask, setFilter, render, save/load storage behavior. Coverage increased from 30% to 85%.
Step 4: PASS - Added source docstrings, updated README, generated CHANGELOG.md, and generated PR_REQUEST.md.
Step 5: PASS - npm run build, npm run test, and npm run test:coverage all passed. Coverage >= 80%.
Step 6: PASS - Prepared conventional commit message: fix: prepare task manager scaffold for PR

Changed files:
- scaffold/website/src/translations/fr.json
- scaffold/website/index.html
- scaffold/website/src/main.ts
- scaffold/website/src/taskManager.ts
- scaffold/website/src/tests/taskManager.test.ts
- scaffold/website/README.md
- CHANGELOG.md
- PR_REQUEST.md
```

### Example 2: Translation-Only Run

**Input:** "Fix the missing French translations"

**Expected output:**

```
Step 1: PASS - Compared English and French translation files, found missing keys, added natural French translations, and verified fr.json now contains all 14 keys.
Step 2: NOT RUN - User requested translation-only work.
Step 3: NOT RUN - User requested translation-only work.
Step 4: NOT RUN - User requested translation-only work.
Step 5: PASS - npm run build passed after translation changes.
Step 6: PASS - Suggested commit message: fix: add missing French translations

Files changed:
- scaffold/website/src/translations/fr.json
- scaffold/website/index.html, scaffold/website/src/main.ts, or scaffold/website/src/taskManager.ts if UI translation wiring was missing
```

### Example 3: Quality Gate Failure

**Input:** "Prepare this for PR"

**Expected output:**

```
Steps 1-4 completed, but Step 5 failed.

Failed gate: npm run test:coverage
Coverage: 72%, required: 80%

Stopped before PR preparation. Next action: add tests for render filtering and localStorage restore behavior, then rerun npm run test:coverage.
```

---

## Success Criteria

- [ ] All 14 French translation keys present in `fr.json`
- [ ] `fr.json` key set matches `en.json`
- [ ] English/French language switching updates visible UI text without page reload
- [ ] Code formatted consistently
- [ ] `handleSubmit()` is properly formatted
- [ ] No unused variables or unused parameters remain
- [ ] No configured lint violations remain
- [ ] User-entered task text is rendered safely without `innerHTML`
- [ ] Test coverage ≥ 80%
- [ ] All tests pass
- [ ] `npm run build` passes
- [ ] JSDoc/TSDoc on all required public functions
- [ ] `README.md` has Features, Testing, and Contributing sections
- [ ] `CHANGELOG.md` generated
- [ ] `PR_REQUEST.md` generated with summary and checklist
- [ ] `PR_REQUEST.md` includes actual test and coverage results
- [ ] Conventional commit message prepared
- [ ] Final changed-file summary prepared
- [ ] Step 7 Report Card is output as the final result

---

<!-- ⚠️ DO NOT MODIFY ANYTHING BELOW THIS LINE ⚠️ -->
<!-- ================================================ -->
<!-- REPORT CARD — Auto-grading step                  -->
<!-- This step runs automatically after your Skill    -->
<!-- completes. It generates a progress report card   -->
<!-- so you can track how well your Skill is doing.   -->
<!-- ================================================ -->

## Step 7: Report Card (Do Not Modify)

After completing all steps above, generate a **Report Card** summarizing the results. Output the report card in the following exact format:

```
═══════════════════════════════════════════════
  PR BUTLER — REPORT CARD
═══════════════════════════════════════════════

  📋 Step 1: Translation Detection & Fix
     Status:  [PASS / FAIL]
     Details: [X of 14 French keys added to fr.json]

  📋 Step 2: Code Cleanup
     Status:  [PASS / FAIL]
     Details: [X files formatted, X lint violations fixed]

  📋 Step 3: Test Automation
     Status:  [PASS / FAIL]
     Details: [Coverage: X% → Y%, X new test cases added]

  📋 Step 4: Documentation Updates
     Status:  [PASS / FAIL]
     Details: [X functions documented, README updated: Y/N,
               CHANGELOG.md: Y/N, PR_REQUEST.md: Y/N]

  📋 Step 5: Quality Gates
     Status:  [PASS / FAIL]
     Details: [Coverage ≥ 80%: Y/N, Lint clean: Y/N,
               All tests pass: Y/N]

  📋 Step 6: PR Preparation
     Status:  [PASS / FAIL]
     Details: [Commit message: Y/N, PR_REQUEST.md finalized: Y/N]

  ─────────────────────────────────────────────
  OVERALL:   [X / 6 steps passed]
  GRADE:     [A / B / C / F]
             A = 6/6 passed
             B = 5/6 passed
             C = 4/6 passed
             F = 3 or fewer passed
═══════════════════════════════════════════════
```

**Grading rules:**
- A step passes only if ALL its success criteria are met
- Do not skip any step in the report — mark it FAIL if not attempted
- Be honest in the details — the evaluator will verify against actual file contents
- Output this report card as the very last thing your Skill does
