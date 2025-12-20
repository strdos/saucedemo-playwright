import { test, expect } from '@playwright/test';
import { InventoryPage } from '@pages/inventoryPage';
import { products } from '@test-data/products';

test.describe('Inventory page cart badge', () => {
  let inventoryPage: InventoryPage;

  test.beforeEach(async ({ page }) => {
    inventoryPage = new InventoryPage(page);

    await page.goto(InventoryPage.url);

    await expect(page).toHaveURL(new RegExp(`${InventoryPage.url}$`));
  });

  test('adds a single item to cart and updates badge', async () => {
    await inventoryPage.addItemsToCart(products.backpack);

    expect(await inventoryPage.getCartCount()).toBe(1);
  });

  test('adds multiple items to cart and updates badge', async () => {
    const items = [products.backpack, products.bikeLight, products.boltTShirt];
    await inventoryPage.addItemsToCart(items);

    expect(await inventoryPage.getCartCount()).toBe(items.length);
  });

  test('removes item from cart and updates badge', async () => {
    await inventoryPage.addItemsToCart(products.backpack);
    expect(await inventoryPage.getCartCount()).toBe(1);

    await inventoryPage.removeItemsFromCart(products.backpack);
    expect(await inventoryPage.getCartCount()).toBe(0);
  });
});
