import type { APIRequestContext } from '@playwright/test';

export class ApiDocsClient {
  constructor(private readonly request: APIRequestContext) {}

  getDocument() {
    return this.request.get('/v3/api-docs', {
      failOnStatusCode: false,
      maxRedirects: 0,
      timeout: 15_000,
    });
  }
}
