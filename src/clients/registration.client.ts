import type { APIRequestContext } from '@playwright/test';

export interface RegistrationData {
  username: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

export type RegistrationRequest = {
  [Field in keyof RegistrationData]?: string | null;
};

export class RegistrationClient {
  constructor(private readonly request: APIRequestContext) {}

  signUp(data: RegistrationRequest, headers: Record<string, string> = {}) {
    return this.request.post('/api/v1/users/signup', {
      data,
      headers,
      failOnStatusCode: false,
      maxRedirects: 0,
      timeout: 15_000,
    });
  }
}
