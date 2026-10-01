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
  constructor(
    private readonly request: APIRequestContext,
    private readonly onRegistered?: (data: RegistrationRequest) => void,
  ) {}

  async signUp(
    data: RegistrationRequest,
    headers: Record<string, string> = {},
  ) {
    const payload = { ...data };
    const response = await this.request.post('/api/v1/users/signup', {
      data: payload,
      headers,
      failOnStatusCode: false,
      maxRedirects: 0,
      timeout: 15_000,
    });
    if (response.status() === 201) this.onRegistered?.(payload);
    return response;
  }
}
