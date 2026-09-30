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
- `tests/support/api.assertions.ts`: shared response assertions.
- `playwright.config.ts`: test execution and reporting.

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

Use `BASE_URL=https://awesome.byst.re` for the documented API and configure
`LOGIN_USERNAME` and `LOGIN_PASSWORD` for a test account without MFA.
Tests target the configured API directly and do not start a demo server.
API tests do not require browser binaries.

| Command                                   | Purpose                  |
| ----------------------------------------- | ------------------------ |
| `npm test`                                | Run all API tests        |
| `npm test -- tests/api/login/400.spec.ts` | Run a specific test file |
| `npm run test:debug`                      | Debug tests              |
| `npm run test:report`                     | Open the HTML report     |
| `npm run lint`                            | Check lint rules         |
| `npm run typecheck`                       | Check TypeScript types   |
| `npm run format:check`                    | Check formatting         |

On Windows, use `npm.cmd` and `npx.cmd` if PowerShell blocks the `.ps1` wrappers.

## Validation and reporting

For code or test changes, run the relevant tests, lint, type checking, and
formatting checks. Playwright does not perform TypeScript type checking itself.
For documentation-only changes, check the formatting of the changed files.

Summarize what changed and the checks performed. State clearly when a check
could not run or a failure remains unresolved.
