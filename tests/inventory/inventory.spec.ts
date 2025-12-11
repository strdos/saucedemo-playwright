import { test, expect } from '@playwright/test';
import { LoginPage } from '@pages/loginPage';
import { InventoryPage } from '@pages/inventoryPage';
import { users, PASSWORD } from '@test-data/users';

test.describe('Inventory - standard user view', () => {
  let inventoryPage: InventoryPage;

  test.beforeEach(async ({ page }) => {
    const loginPage = new LoginPage(page);
    inventoryPage = new InventoryPage(page);

    await loginPage.goto();
    await loginPage.login(users.standard, PASSWORD);

    await expect(page).toHaveURL(new RegExp(`${InventoryPage.url}$`));
    await expect(inventoryPage.title).toHaveText('Products');
  });

  test('each product shows name, price and Add to cart button', async ({ page }) => {
    const itemCount = await inventoryPage.inventoryItems.count();
    expect(itemCount).toBeGreaterThan(0);

    for (let i = 0; i < itemCount; i++) {
      const item = inventoryPage.inventoryItems.nth(i);

      await expect(item.getByTestId('inventory-item-name')).toBeVisible();
      await expect(item.getByTestId('inventory-item-price')).toBeVisible();
      await expect(item.getByRole('button', { name: 'Add to cart' })).toBeVisible();
    }
  });

  test('shows cart icon with empty badge initially', async () => {
    await expect(inventoryPage.cartLink).toBeVisible();
    await expect(inventoryPage.cartBadge).not.toBeVisible();
  });

  test('increments cart badge when adding an item', async ({ page }) => {
    const firstItem = inventoryPage.inventoryItems.first();
    await firstItem.getByRole('button', { name: 'Add to cart' }).click();

    await expect(inventoryPage.cartBadge).toHaveText('1');
  });

  test('sorts products by price low to high', async () => {
    await inventoryPage.sortBy('lohi');

    const prices = await inventoryPage.getItemPrices();
    const sorted = [...prices].sort((a, b) => a - b);

    expect(prices).toEqual(sorted);
  });

  test('sorts products by name Z to A', async () => {
    await inventoryPage.sortBy('za');

    const names = await inventoryPage.getItemNames();
    const sorted = [...names].sort().reverse();

    expect(names).toEqual(sorted);
  });
});
