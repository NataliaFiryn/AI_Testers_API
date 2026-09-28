import type { APIRequestContext } from '@playwright/test';

export class HealthClient {
  private readonly request: APIRequestContext;

  constructor(request: APIRequestContext) {
    this.request = request;
  }

  getHealth() {
    return this.request.get('/health');
  }
}
