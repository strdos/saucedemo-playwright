import { test } from '@playwright/test';
import { LoginPage } from '@pages/loginPage';
import { InventoryPage } from '@pages/inventoryPage';
import { users, PASSWORD } from '@test-data/users';

test('authenticate as standard user', async ({ page }) => {
  const loginPage = new LoginPage(page);

  await loginPage.goto();
  await loginPage.login(users.standard, PASSWORD);

  await page.waitForURL(InventoryPage.url);

  await page.context().storageState({
    path: 'test-results/storageStates/standard-user.json',
  });
});
