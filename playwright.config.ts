import { defineConfig } from '@playwright/test';
import { env } from './src/config/env.js';

const demoURL = 'http://127.0.0.1:3100/';

export default defineConfig({
  testDir: './tests/api',
  fullyParallel: true,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  timeout: 30_000,
  expect: { timeout: 5_000 },
  reporter: [['list'], ['html', { open: 'never' }]],
  use: {
    baseURL: env.baseURL,
    extraHTTPHeaders: { Accept: 'application/json' },
    trace: 'retain-on-failure',
  },
  webServer:
    env.baseURL === demoURL
      ? {
          command:
            'node --experimental-strip-types tests/support/demo-server.ts',
          url: `${demoURL}health`,
          reuseExistingServer: false,
          timeout: 15_000,
        }
      : undefined,
});
