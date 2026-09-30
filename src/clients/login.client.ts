import type { APIRequestContext } from '@playwright/test';

export interface LoginCredentials {
  username: string;
  password: string;
}

// Missing and null fields are intentional authentication edge cases.
export interface LoginRequest {
  username?: string | null;
  password?: string | null;
}

export class LoginClient {
  constructor(private readonly request: APIRequestContext) {}

  signIn(credentials: LoginRequest, headers: Record<string, string> = {}) {
    return this.request.post('/api/v1/users/signin', {
      data: credentials,
      headers,
      failOnStatusCode: false,
      maxRedirects: 0,
      timeout: 15_000,
    });
  }
}
