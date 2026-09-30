import { defineConfig } from '@playwright/test';
import { env } from './src/config/env.js';

export default defineConfig({
  testDir: './tests/api',
  fullyParallel: true,
  forbidOnly: Boolean(process.env.CI),
  retries: 0,
  workers: 1,
  timeout: 30_000,
  expect: { timeout: 5_000 },
  reporter: [['list'], ['html', { open: 'never' }]],
  use: {
    baseURL: env.baseURL,
    extraHTTPHeaders: { Accept: 'application/json' },
    // Authentication traces contain credentials and tokens.
    trace: 'off',
  },
});
