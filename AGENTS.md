# Agent instructions

## Purpose and language

Write and maintain API tests and fix bugs in this repository.
Use English for responses, new documentation, comments, identifiers, and test names.

## Project context

This project uses Playwright Test and TypeScript for API testing, with ESLint,
Prettier, and Husky. It requires Node.js 22.17 or later and npm.

- `tests/api/`: API scenarios and assertions (`*.spec.ts`).
- `tests/fixtures/api.fixture.ts`: shared fixtures exposing API clients.
- `src/clients/`: endpoint clients using Playwright's `APIRequestContext`.
- `src/config/env.ts`: environment configuration and validation.
- `tests/support/demo-server.ts`: local demonstration API.
- `playwright.config.ts`: test execution, reporting, and demo server setup.

## Working conventions

- Follow the existing client and fixture pattern. Keep request logic in API
  clients and scenario assertions in test files.
- Import `test` and `expect` from the shared API fixture when using its clients.
- Use TypeScript with strict typing and `.js` extensions in relative imports,
  following the project's NodeNext configuration.
- Name tests to describe the endpoint and expected behavior in English.
- Check status codes, relevant headers, and response bodies against the API
  contract. Include error and boundary cases when relevant to the task.
- Keep tests independent so they can run in parallel.
- When fixing a bug, reproduce the failure and add or update a regression test
  where practical.
- Follow the existing ESLint and Prettier configuration.

## Setup and commands

Install dependencies with `npm ci`. If `.env` is missing, copy `.env.example`
to `.env`. `BASE_URL` is required; environment variables take precedence over
values in `.env`.

With `BASE_URL=http://127.0.0.1:3100`, Playwright automatically starts and stops
the demo server. Port 3100 must be available. Other base URLs target an external
API and do not start the demo server. API tests do not require browser binaries.

| Command                                | Purpose                  |
| -------------------------------------- | ------------------------ |
| `npm test`                             | Run all API tests        |
| `npm test -- tests/api/health.spec.ts` | Run a specific test file |
| `npm run test:debug`                   | Debug tests              |
| `npm run test:report`                  | Open the HTML report     |
| `npm run lint`                         | Check lint rules         |
| `npm run typecheck`                    | Check TypeScript types   |
| `npm run format:check`                 | Check formatting         |

On Windows, use `npm.cmd` and `npx.cmd` if PowerShell blocks the `.ps1` wrappers.

## Validation and reporting

For code or test changes, run the relevant tests, lint, type checking, and
formatting checks. Playwright does not perform TypeScript type checking itself.
For documentation-only changes, check the formatting of the changed files.

Summarize what changed and the checks performed. State clearly when a check
could not run or a failure remains unresolved.
