import type { APIRequestContext } from '@playwright/test';

export class UsersClient {
  constructor(private readonly request: APIRequestContext) {}

  me(headers: Record<string, string> = {}) {
    return this.request.get('/api/v1/users/me', {
      headers,
      failOnStatusCode: false,
      maxRedirects: 0,
      timeout: 15_000,
    });
  }

  forget(username: string, headers: Record<string, string> = {}) {
    return this.request.delete(
      `/api/v1/users/${encodeURIComponent(username)}/right-to-be-forgotten`,
      {
        headers,
        failOnStatusCode: false,
        maxRedirects: 0,
        timeout: 15_000,
      },
    );
  }
}
