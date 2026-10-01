import { test as base } from '@playwright/test';
import { ApiDocsClient } from '../../src/clients/api-docs.client.js';
import {
  LoginClient,
  type LoginCredentials,
} from '../../src/clients/login.client.js';
import { getLoginCredentials } from '../../src/config/env.js';
import { RegistrationClient } from '../../src/clients/registration.client.js';

export const test = base.extend<{
  apiDocsClient: ApiDocsClient;
  loginClient: LoginClient;
  credentials: LoginCredentials;
  registrationClient: RegistrationClient;
}>({
  apiDocsClient: async ({ request }, use) => {
    await use(new ApiDocsClient(request));
  },
  registrationClient: async ({ request }, use) => {
    await use(new RegistrationClient(request));
  },
  loginClient: async ({ request }, use) => {
    await use(new LoginClient(request));
  },
  // Playwright requires an object destructuring pattern for fixture dependencies.
  // eslint-disable-next-line no-empty-pattern
  credentials: async ({}, use) => {
    await use(getLoginCredentials());
  },
});

export { expect } from '@playwright/test';
