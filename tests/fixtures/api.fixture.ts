import { test as base } from '@playwright/test';
import { HealthClient } from '../../src/clients/health.client.js';

export const test = base.extend<{ healthClient: HealthClient }>({
  healthClient: async ({ request }, use) => {
    await use(new HealthClient(request));
  },
});

export { expect } from '@playwright/test';
