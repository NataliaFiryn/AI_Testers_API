# API coverage tracker

Updated: **2026-10-01**. Source: [api-docs.json](api-docs.json).
Each endpoint is one **method + path**. Status tracks implemented tests; live results
were not verified in this review.

**Coverage: 3/53 endpoints (5.7%)** ? public: **2/10**, protected: **1/43**.
**✅ 1 baseline covered ? 🟡 2 partial ? ⬜ 50 not started.**

- ✅ **Covered:** documented responses and baseline scenarios have dedicated tests.
- 🟡 **Partial:** tests exist; known gaps remain.
- ⬜ **Not started:** no dedicated behavioral tests.
- Use **In progress** or **Blocked** when needed; add a short note or issue link.

## Endpoints

Public = no bearer token required; other tokens/session headers may still be needed.
Bearer = authentication required; role/ownership rules follow the contract.
**Linked response codes are tested; unlinked codes are pending.**

| ID      | Endpoint                                                | Access | Status         | Response codes / tests                                                                                                                              |
| ------- | ------------------------------------------------------- | ------ | -------------- | --------------------------------------------------------------------------------------------------------------------------------------------------- |
| API-001 | `GET /api/v1/admin/inventory`                           | Bearer | ⬜ Not started | 200, 400, 401, 403                                                                                                                                  |
| API-002 | `GET /api/v1/admin/inventory/{productId}`               | Bearer | ⬜ Not started | 200, 400, 401, 403, 404                                                                                                                             |
| API-003 | `POST /api/v1/admin/inventory/{productId}/adjustments`  | Bearer | ⬜ Not started | 201, 400, 401, 403, 404, 409                                                                                                                        |
| API-004 | `GET /api/v1/admin/inventory/{productId}/movements`     | Bearer | ⬜ Not started | 200, 400, 401, 403, 404                                                                                                                             |
| API-005 | `DELETE /api/v1/cart`                                   | Bearer | ⬜ Not started | 204, 401                                                                                                                                            |
| API-006 | `GET /api/v1/cart`                                      | Bearer | ⬜ Not started | 200, 401                                                                                                                                            |
| API-007 | `POST /api/v1/cart/items`                               | Bearer | ⬜ Not started | 200, 400, 401, 404, 409                                                                                                                             |
| API-008 | `DELETE /api/v1/cart/items/{productId}`                 | Bearer | ⬜ Not started | 200, 400, 401, 404                                                                                                                                  |
| API-009 | `PUT /api/v1/cart/items/{productId}`                    | Bearer | ⬜ Not started | 200, 400, 401, 404, 409                                                                                                                             |
| API-010 | `POST /api/v1/email`                                    | Bearer | ⬜ Not started | 200, 400, 401, 429                                                                                                                                  |
| API-011 | `POST /api/v1/ollama/chat`                              | Bearer | ⬜ Not started | 200, 400, 401, 404, 429, 500, default                                                                                                               |
| API-012 | `POST /api/v1/ollama/chat/tools`                        | Bearer | ⬜ Not started | 200, 400, 401, 404, 429, 500, default                                                                                                               |
| API-013 | `GET /api/v1/ollama/chat/tools/definitions`             | Bearer | ⬜ Not started | 200, 401                                                                                                                                            |
| API-014 | `POST /api/v1/ollama/generate`                          | Bearer | ⬜ Not started | 200, 400, 401, 404, 429, 500, default                                                                                                               |
| API-015 | `GET /api/v1/orders`                                    | Bearer | ⬜ Not started | 200, 400, 401                                                                                                                                       |
| API-016 | `POST /api/v1/orders`                                   | Bearer | ⬜ Not started | 201, 400, 401, 404, 409                                                                                                                             |
| API-017 | `GET /api/v1/orders/{id}`                               | Bearer | ⬜ Not started | 200, 400, 401, 404                                                                                                                                  |
| API-018 | `POST /api/v1/orders/{id}/cancel`                       | Bearer | ⬜ Not started | 200, 400, 401, 403, 404                                                                                                                             |
| API-019 | `PUT /api/v1/orders/{id}/status`                        | Bearer | ⬜ Not started | 200, 400, 401, 403, 404                                                                                                                             |
| API-020 | `GET /api/v1/orders/admin`                              | Bearer | ⬜ Not started | 200, 400, 401, 403                                                                                                                                  |
| API-021 | `GET /api/v1/products`                                  | Bearer | ⬜ Not started | 200, 401                                                                                                                                            |
| API-022 | `POST /api/v1/products`                                 | Bearer | ⬜ Not started | 201, 400, 401, 403                                                                                                                                  |
| API-023 | `DELETE /api/v1/products/{id}`                          | Bearer | ⬜ Not started | 204, 400, 401, 403, 404                                                                                                                             |
| API-024 | `GET /api/v1/products/{id}`                             | Bearer | ⬜ Not started | 200, 400, 401, 404                                                                                                                                  |
| API-025 | `PUT /api/v1/products/{id}`                             | Bearer | ⬜ Not started | 200, 400, 401, 403, 404                                                                                                                             |
| API-026 | `POST /api/v1/qr/create`                                | Bearer | ⬜ Not started | 200, 400, 401, 429                                                                                                                                  |
| API-027 | `GET /api/v1/traffic/info`                              | Public | ⬜ Not started | 200, 400, 401                                                                                                                                       |
| API-028 | `GET /api/v1/traffic/logs`                              | Public | ⬜ Not started | 200, 400, 401                                                                                                                                       |
| API-029 | `GET /api/v1/traffic/logs/{correlationId}`              | Public | ⬜ Not started | 200, 400, 401, 404                                                                                                                                  |
| API-030 | `GET /api/v1/users`                                     | Bearer | ⬜ Not started | 200, 401                                                                                                                                            |
| API-031 | `DELETE /api/v1/users/{username}`                       | Bearer | ⬜ Not started | 204, 401, 403, 404                                                                                                                                  |
| API-032 | `GET /api/v1/users/{username}`                          | Bearer | ⬜ Not started | 200, 401, 404                                                                                                                                       |
| API-033 | `PUT /api/v1/users/{username}`                          | Bearer | ⬜ Not started | 200, 400, 401, 403, 404                                                                                                                             |
| API-034 | `DELETE /api/v1/users/{username}/right-to-be-forgotten` | Bearer | ⬜ Not started | 204, 401, 403, 404                                                                                                                                  |
| API-035 | `POST /api/v1/users/2fa/confirm`                        | Bearer | ⬜ Not started | 200, 400, 401, 404, 409, 410, 429                                                                                                                   |
| API-036 | `POST /api/v1/users/2fa/disable`                        | Bearer | ⬜ Not started | 200, 400, 401, 404, 409, 422, 429                                                                                                                   |
| API-037 | `POST /api/v1/users/2fa/recovery-codes`                 | Bearer | ⬜ Not started | 200, 400, 401, 404, 409, 422, 429                                                                                                                   |
| API-038 | `POST /api/v1/users/2fa/setup`                          | Bearer | ⬜ Not started | 200, 401, 404, 409, 429                                                                                                                             |
| API-039 | `GET /api/v1/users/2fa/status`                          | Bearer | ⬜ Not started | 200, 401                                                                                                                                            |
| API-040 | `GET /api/v1/users/chat-system-prompt`                  | Bearer | ⬜ Not started | 200, 401                                                                                                                                            |
| API-041 | `PUT /api/v1/users/chat-system-prompt`                  | Bearer | ⬜ Not started | 200, 400, 401                                                                                                                                       |
| API-042 | `POST /api/v1/users/logout`                             | Bearer | ⬜ Not started | 200, 401                                                                                                                                            |
| USER-01 | `GET /api/v1/users/me`                                  | Bearer | ✅ Covered     | [200](tests/api/users/me/200.spec.ts), [401](tests/api/users/me/401.spec.ts)                                                                        |
| API-043 | `GET /api/v1/users/me/email-events`                     | Bearer | ⬜ Not started | 200, 401                                                                                                                                            |
| API-044 | `POST /api/v1/users/password/forgot`                    | Public | ⬜ Not started | 202, 400, 401, 429                                                                                                                                  |
| API-045 | `POST /api/v1/users/password/reset`                     | Public | ⬜ Not started | 200, 400, 401, 429                                                                                                                                  |
| API-046 | `POST /api/v1/users/refresh`                            | Public | ⬜ Not started | 200, 400, 401, 429                                                                                                                                  |
| AUTH-01 | `POST /api/v1/users/signin`                             | Public | 🟡 Partial     | [200](tests/api/login/200.spec.ts), [400](tests/api/login/400.spec.ts), [401](tests/api/login/401.spec.ts), [422](tests/api/login/422.spec.ts), 429 |
| API-047 | `POST /api/v1/users/signin/2fa`                         | Public | ⬜ Not started | 200, 400, 401, 429                                                                                                                                  |
| AUTH-02 | `POST /api/v1/users/signup`                             | Public | 🟡 Partial     | [201](tests/api/registration/201.spec.ts), [400](tests/api/registration/400.spec.ts), [401](tests/api/registration/401.spec.ts), 429                |
| API-048 | `POST /api/v1/users/sso/exchange`                       | Public | ⬜ Not started | 200, 400, 401, 404, 409                                                                                                                             |
| API-049 | `GET /api/v1/users/tool-system-prompt`                  | Bearer | ⬜ Not started | 200, 401                                                                                                                                            |
| API-050 | `PUT /api/v1/users/tool-system-prompt`                  | Bearer | ⬜ Not started | 200, 400, 401                                                                                                                                       |

## Key gaps and tracking

- **AUTH-01 ? Login:** missing MFA challenge branch (200) and rate limiting (429).
- **AUTH-02 ? Registration:** missing 429; password maximum discrepancy remains (72 bytes vs documented 255 characters; see [limitations](README.md#key-limitations)).
- **USER-01 ? Current user:** 200 profile and 401 missing/malformed/tampered-token checks implemented. Expired-token test is an optional extension.
- [API documentation check](tests/api/api-docs/200.spec.ts) and generator tests are outside the 53-endpoint coverage count. Right-to-be-forgotten is used for cleanup only and still needs dedicated tests.

When adding tests, update the row's status, response links, gaps, and summary counts
in the same change. Keep IDs stable. Record run results separately below; implemented
tests do not imply a passing run or exhaustive scenario coverage.

| Date       | IDs | Run result / report or issue |
| ---------- | --- | ---------------------------- |
| 2026-10-01 | All | Not run; source review only  |
