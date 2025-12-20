import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,

  reporter: 'html',

  use: {
    baseURL: 'https://www.saucedemo.com',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    testIdAttribute: 'data-test',
  },

  projects: [
    {
      name: 'setup',
      testMatch: /auth\.setup\.ts/,
    },
    {
      name: 'standard-user',
      dependencies: ['setup'],
      testIgnore: /auth\//,
      use: {
        ...devices['Desktop Chrome'],
        storageState: 'test-results/storageStates/standard-user.json',
      },
    },
    {
      name: 'chromium-auth',
      testMatch: /auth\//,
      use: { ...devices['Desktop Chrome'] },
    },
  ],
});
