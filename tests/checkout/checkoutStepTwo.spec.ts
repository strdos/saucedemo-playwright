import { test, expect } from '@playwright/test';
import { LoginPage } from '@pages/loginPage';
import { InventoryPage } from '@pages/inventoryPage';
import { CartPage } from '@pages/cartPage';
import { CheckoutStepOnePage } from '@pages/checkoutStepOne';
import { CheckoutStepTwoPage } from '@pages/checkoutStepTwo';
import { users, PASSWORD } from '@test-data/users';
import { products } from '@test-data/products';

test.describe('Checkout step two - overview page', () => {
  let inventoryPage: InventoryPage;
  let cartPage: CartPage;
  let checkoutStepOnePage: CheckoutStepOnePage;
  let checkoutStepTwoPage: CheckoutStepTwoPage;

  test.beforeEach(async ({ page }) => {
    const loginPage = new LoginPage(page);
    inventoryPage = new InventoryPage(page);
    cartPage = new CartPage(page);
    checkoutStepOnePage = new CheckoutStepOnePage(page);
    checkoutStepTwoPage = new CheckoutStepTwoPage(page);

    await loginPage.goto();
    await loginPage.login(users.standard, PASSWORD);

    await inventoryPage.addItemsToCart(products.backpack);
    await inventoryPage.goToCart();
    await cartPage.checkout();

    await checkoutStepOnePage.fillCheckoutInformation('John', 'Doe', '12345');
    await checkoutStepOnePage.continueCheckout();
  });

  test('loads checkout overview page', async ({ page }) => {
    await expect(page).toHaveURL(new RegExp('/checkout-step-two.html$'));
    await expect(checkoutStepTwoPage.title).toHaveText('Checkout: Overview');
  });

  test('displays all products in the cart', async () => {
    const itemNames = await checkoutStepTwoPage.getItemNames();

    expect(itemNames).toContain(products.backpack);
  });

  test('displays correct product prices', async () => {
    const prices = await checkoutStepTwoPage.getItemPrices();

    expect(prices.length).toBeGreaterThan(0);
    expect(prices[0]).toBeGreaterThan(0);
  });

  test('displays payment and shipping information', async () => {
    const payment = await checkoutStepTwoPage.paymentInfo.textContent();
    const shipping = await checkoutStepTwoPage.shippingInfo.textContent();

    expect(payment).toBeTruthy();
    expect(shipping).toBeTruthy();
  });

  test('displays correct subtotal, tax, and total', async () => {
    const subtotal = await checkoutStepTwoPage.getSubtotal();
    const tax = await checkoutStepTwoPage.getTax();
    const total = await checkoutStepTwoPage.getTotal();

    expect(subtotal).toBeGreaterThan(0);
    expect(tax).toBeGreaterThanOrEqual(0);
    expect(total).toBeGreaterThanOrEqual(subtotal + tax);
  });

  test('cancel navigates back to inventory', async ({ page }) => {
    await checkoutStepTwoPage.cancel();

    await expect(page).toHaveURL(new RegExp('/inventory.html$'));
  });

  test('finish completes checkout', async ({ page }) => {
    await checkoutStepTwoPage.finishCheckout();

    await expect(page).toHaveURL(new RegExp('/checkout-complete.html$'));
  });
});
