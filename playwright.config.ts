import { defineConfig, devices } from '@playwright/test';

/**
 * Read environment variables from file.
 * https://github.com/motdotla/dotenv
 */
// require('dotenv').config();

// Check for CI environment
const isCI = process.env.CI === 'true';

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
    testMatch: '**/*.test.ts',
    /* Run tests in files in parallel */
    fullyParallel: true,
    /* Fail the build on CI if you accidentally left test.only in the source code. */
    forbidOnly: isCI,
    /* Retry on CI only */
    retries: isCI ? 2 : 0,
    /* Opt out of parallel tests on CI. */
    workers: isCI ? 1 : undefined,
    /* Reporter to use. See https://playwright.dev/docs/test-reporters */
    reporter: 'html',
    /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
    use: {
        /* Base URL to use in actions like `await page.goto('/')`. */
        baseURL: 'http://localhost:3000',

        /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
        trace: 'on-first-retry'
    },

    /* Configure projects for major browsers */
    projects: [
        // UI Test Projects
        {
            name: 'chromium-ui',
            testMatch: 'tests/ui/**/*.test.ts',
            use: { ...devices['Desktop Chrome'] }
        },
        {
            name: 'firefox-ui',
            testMatch: 'tests/ui/**/*.test.ts',
            use: { ...devices['Desktop Firefox'] }
        },
        {
            name: 'webkit-ui',
            testMatch: 'tests/ui/**/*.test.ts',
            use: { ...devices['Desktop Safari'] }
        },

        // API Test Projects
        {
            name: 'chromium-api',
            testMatch: 'tests/api/**/*.test.ts',
            use: { ...devices['Desktop Chrome'] }
        },

        // Example Tests
        {
            name: 'examples',
            testMatch: 'tests/examples/**/*.test.ts',
            use: { ...devices['Desktop Chrome'] }
        }
    ],

    /* Run your local dev server before starting the tests */
    webServer: {
        command: 'pnpm run dev',
        url: 'http://localhost:3000',
        reuseExistingServer: !isCI
    }
});
