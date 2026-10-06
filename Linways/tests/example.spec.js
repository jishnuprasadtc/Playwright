import { test, expect } from '@playwright/test';

test('advance_report', async ({ page }) => {
  const username = process.env.LINWAYS_USERNAME;
  const password = process.env.LINWAYS_PASSWORD;

  if (!username || !password) {
    throw new Error('Copy .env.example to .env and set valid LINWAYS_USERNAME and LINWAYS_PASSWORD values.');
  }

  await page.goto('https://cht14v4.linways.com/ams/faculty/login');
  await page.getByRole('textbox', { name: 'Login' }).fill(username);
  await page.getByRole('textbox', { name: 'Password' }).fill(password);
  await page.getByRole('button', { name: 'Sign in', exact: true }).click();
  const appsLink = page.getByRole('link', { name: 'apps' });
  const invalidCredentials = page.getByText('Invalid user name or password', { exact: true });
  const loginResult = await Promise.race([
    appsLink.waitFor({ state: 'visible' }).then(() => 'authenticated'),
    invalidCredentials.waitFor({ state: 'visible' }).then(() => 'rejected'),
  ]);

  expect(loginResult, 'Linways rejected the supplied username or password.').toBe('authenticated');
  await appsLink.click();
  await page.getByRole('menu', { name: 'apps' }).getByText('Faculty', { exact: true }).click();
  const page1Promise = page.waitForEvent('popup');
  await page.getByRole('menu', { name: 'apps' }).getByText('apartment').click();
  const page1 = await page1Promise;
  await page1.goto('https://cht14v4.linways.com/hostel/dashboard');
  await page1.getByRole('link', { name: 'apps' }).click();
  const page2Promise = page1.waitForEvent('popup');
  await page1.getByRole('menu', { name: 'apps' }).getByText('apartment').click();
  const page2 = await page2Promise;
  await page2.getByRole('link', { name: 'Reports ' }).click();
  await page2.getByRole('link', { name: 'Attendance Report' }).click();
  await page2.locator('input[type="search"]').click();
  await page2.getByRole('textbox').first().click();
  await page2.getByLabel('Month').first().selectOption('0');
  await page2.getByLabel('January 1,').click();
  await page2.locator('#messExpectedFromDate').fill('2026-01-01');
  await page2.locator('input[type="search"]').click();
  await page2.locator('input[type="search"]').click();
  await page2.locator('input[type="search"]').click();
  await page2.getByRole('button', { name: ' Search' }).click();
  await expect(page2.getByRole('table').first()).toBeVisible();
});