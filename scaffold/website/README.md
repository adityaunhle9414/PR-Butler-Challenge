# Task Manager App

A TypeScript task management application with task priorities, completion filters, persistence, and English/French UI translations.

## Features

- Add tasks with low, medium, or high priority.
- Mark tasks as completed and view completion statistics.
- Filter the task list by all, active, or completed tasks.
- Persist tasks in browser localStorage between page loads.
- Switch the interface between English and French.

## Setup

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```

## Testing

Run the unit test suite once:

```bash
npm run test
```

Run tests with coverage reporting:

```bash
npm run test:coverage
```

The PR Butler quality gate requires all tests to pass and project coverage to stay at or above 80%.

## Contributing

Before opening a pull request:

1. Keep translations in `src/translations/en.json` and `src/translations/fr.json` synchronized.
2. Add or update focused tests for task behavior changes.
3. Run `npm run build`, `npm run test`, and `npm run test:coverage`.
4. Update documentation and PR notes when user-facing behavior changes.
