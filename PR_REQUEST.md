# fix: prepare task manager scaffold for PR

## Summary

- Added complete French translations and refreshed UI text when switching languages.
- Cleaned task manager source code, including safe rendering for user-entered task text.
- Expanded TaskManager test coverage across task state, DOM rendering, filtering, and persistence.
- Updated README documentation and generated PR preparation artifacts.

## Quality Gates

- [x] `npm run build`
- [x] `npm run test`
- [x] `npm run test:coverage`
- [x] Coverage >= 80%
- [x] No TypeScript unused variable or unused parameter errors

## Test Results

- Build: passed
- Tests: 16 passed across 3 test files
- Coverage: 100% statements, 98.14% branches, 100% functions, 100% lines

## Files Changed

- `scaffold/website/src/translations/fr.json`
- `scaffold/website/index.html`
- `scaffold/website/src/main.ts`
- `scaffold/website/src/taskManager.ts`
- `scaffold/website/src/tests/taskManager.test.ts`
- `scaffold/website/src/tests/i18n.test.ts`
- `scaffold/website/src/tests/main.test.ts`
- `scaffold/website/README.md`
- `scaffold/website/package.json`
- `scaffold/website/package-lock.json`
- `CHANGELOG.md`
- `PR_REQUEST.md`

## Risks And Notes

- The test environment uses jsdom because Vitest is configured with `environment: 'jsdom'`.
- No standalone ESLint or Prettier command is configured; TypeScript strict mode and build validation are used for code quality gates.
