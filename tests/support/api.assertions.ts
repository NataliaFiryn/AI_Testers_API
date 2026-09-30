import type { APIResponse } from '@playwright/test';
import { expect } from '../fixtures/api.fixture.js';

export function expectJsonResponse(response: APIResponse, status: number) {
  expect(response.status()).toBe(status);
  expect(response.headers()['content-type']).toMatch(/^application\/json\b/i);
  expect(response.headers()['cache-control']).toContain('no-store');
}

export async function expectAuthenticationError(
  response: APIResponse,
  status: number,
  message: string,
) {
  expectJsonResponse(response, status);
  expect(await response.json()).toEqual({ message });
}
