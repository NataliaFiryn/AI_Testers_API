# AI TESTERS vol2 API Tests

API tests built with Playwright and TypeScript for [awesome.byst.re](https://awesome.byst.re),
covering login, registration, and the current user profile. API contract: [api-docs.json](api-docs.json).

## Setup

Requires **Node.js 22.17+** and **npm**. No browser installation is needed.

1. Run `npm ci`.
2. Copy `.env.example` to `.env`.
3. Set `BASE_URL=https://awesome.byst.re`. For login tests, set `LOGIN_USERNAME`
   and `LOGIN_PASSWORD` for a test account with MFA disabled.
4. Run `npm test`.

Keep credentials in the ignored `.env` file or CI secrets. Environment variables
take precedence over `.env`.

## Commands

| Command                              | Purpose                |
| ------------------------------------ | ---------------------- |
| `npm test`                           | Run all API tests      |
| `npm test -- tests/api/login`        | Run login tests        |
| `npm test -- tests/api/registration` | Run registration tests |
| `npm run test:report`                | Open the HTML report   |
| `npm run lint`                       | Check lint rules       |
| `npm run typecheck`                  | Check TypeScript types |
| `npm run format:check`               | Check formatting       |

On Windows, use `npm.cmd` if PowerShell blocks npm's script wrapper.

## Project structure

- `tests/api/`: test scenarios grouped by endpoint and status code.
- `src/clients/`: API request clients.
- `tests/fixtures/`: shared test fixtures.
- `Generators/`: registration test data generators.
- `src/config/env.ts`: environment configuration.

## Authenticated tests

Use `authenticatedUser` from `tests/fixtures/api.fixture.ts` to register and then
log in a new user for each test. It returns `{ user, token }`, where `user` is
the original generated registration data (including the password) and `token`
is the access JWT. Only `BASE_URL` is required; existing login credentials are
not used. Pass the token explicitly to clients:

```ts
const response = await usersClient.me({
  Authorization: `Bearer ${authenticatedUser.token}`,
});
```

Run `npm test -- tests/api/users/me` for profile and authentication checks.
The fixture deletes its own generated account after the test through the
right-to-be-forgotten endpoint, including after test failures. Cleanup failures
are reported; an account may remain if registration succeeds but login fails
before a usable token is obtained. Do not log the returned credentials or JWT.

## Key limitations

- Registration tests create persistent accounts and require only `BASE_URL`.
- MFA and rate-limit responses are not covered.
- The API rejects passwords over 72 bytes despite the documented 255-character
  maximum; the 255-character password case is not covered.
