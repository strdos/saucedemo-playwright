import { test, expect } from '@playwright/test';
import { LoginPage } from '@pages/loginPage';
import { InventoryPage } from '@pages/inventoryPage';
import { CartPage } from '@pages/cartPage';
import { users, PASSWORD } from '@test-data/users';
import { products } from '@test-data/products';

test.describe('Cart page - standard user flows', () => {
  let inventoryPage: InventoryPage;
  let cartPage: CartPage;

  test.beforeEach(async ({ page }) => {
    const loginPage = new LoginPage(page);
    inventoryPage = new InventoryPage(page);
    cartPage = new CartPage(page);

    await loginPage.goto();
    await loginPage.login(users.standard, PASSWORD);
  });

  test('empty cart shows zero items', async () => {
    await inventoryPage.goToCart();
    const itemNames = await cartPage.getItemNames();

    expect(await cartPage.cartItems.count()).toBe(0);
    expect(itemNames).toHaveLength(0);
  });

  test('displays products added from inventory', async () => {
    await inventoryPage.addItemsToCart(products.backpack);
    await inventoryPage.goToCart();

    const itemNames = await cartPage.getItemNames();
    expect(itemNames).toContain(products.backpack);
    expect(await cartPage.cartItems.count()).toBe(1);
  });

  test('adds multiple products correctly', async () => {
    const items = [products.backpack, products.bikeLight, products.boltTShirt];
    await inventoryPage.addItemsToCart(items);
    await inventoryPage.goToCart();

    const itemNames = await cartPage.getItemNames();
    expect(itemNames).toEqual(expect.arrayContaining(items));
    expect(await cartPage.cartItems.count()).toBe(items.length);
  });

  test('removes an item from the cart', async () => {
    await inventoryPage.addItemsToCart(products.backpack);
    await inventoryPage.goToCart();

    await cartPage.removeItem(products.backpack);

    expect(await cartPage.cartItems.count()).toBe(0);
    const itemNames = await cartPage.getItemNames();
    expect(itemNames).not.toContain(products.backpack);
  });

  test('continue shopping navigates back to inventory', async ({ page }) => {
    await inventoryPage.goToCart();
    await cartPage.continueShoppingButton.click();
    await expect(page).toHaveURL(new RegExp(`${InventoryPage.url}$`));
  });

  test('checkout button navigates to checkout step one', async ({ page }) => {
    await inventoryPage.addItemsToCart(products.backpack);
    await inventoryPage.goToCart();

    await cartPage.checkoutButton.click();
    await expect(page).toHaveURL(new RegExp('/checkout-step-one.html$'));
  });
});
