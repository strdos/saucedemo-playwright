import { test, expect } from '@playwright/test';
import { InventoryPage } from '@pages/inventoryPage';
import { CartPage } from '@pages/cartPage';
import { CheckoutStepOnePage } from '@pages/checkoutStepOne';
import { CheckoutStepTwoPage } from '@pages/checkoutStepTwo';
import { CheckoutCompletePage } from '@pages/checkoutCompletePage';
import { products } from '@test-data/products';
import { checkoutCompleteMessages } from '@test-data/checkout-complete-messages';

test.describe('Checkout complete - confirmation page', () => {
  let inventoryPage: InventoryPage;
  let cartPage: CartPage;
  let stepOnePage: CheckoutStepOnePage;
  let stepTwoPage: CheckoutStepTwoPage;
  let completePage: CheckoutCompletePage;

  test.beforeEach(async ({ page }) => {
    inventoryPage = new InventoryPage(page);
    cartPage = new CartPage(page);
    stepOnePage = new CheckoutStepOnePage(page);
    stepTwoPage = new CheckoutStepTwoPage(page);
    completePage = new CheckoutCompletePage(page);

    await page.goto(InventoryPage.url);

    await inventoryPage.addItemsToCart(products.backpack);
    await inventoryPage.goToCart();
    await cartPage.checkout();

    await stepOnePage.fillCheckoutInformation('John', 'Doe', '12345');
    await stepOnePage.continueCheckout();

    await stepTwoPage.finishCheckout();
  });

  test('loads checkout complete page', async ({ page }) => {
    await expect(page).toHaveURL(new RegExp(`${CheckoutCompletePage.url}$`));
    await expect(completePage.title).toHaveText('Checkout: Complete!');
  });

  test('displays order confirmation message and clears cart', async () => {
    await expect(completePage.title).toBeVisible();

    const text = await completePage.getConfirmationText();
    expect(text).toContain(checkoutCompleteMessages.thankYou);

    await expect(inventoryPage.cartBadge).not.toBeVisible();
  });

  test('back home navigates to inventory', async ({ page }) => {
    await completePage.backHome();
    await expect(page).toHaveURL(new RegExp(`${InventoryPage.url}$`));
  });
});
