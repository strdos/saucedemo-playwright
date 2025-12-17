import { test, expect } from '@playwright/test';
import { LoginPage } from '@pages/loginPage';
import { InventoryPage } from '@pages/inventoryPage';
import { CartPage } from '@pages/cartPage';
import { CheckoutStepOnePage } from '@pages/checkoutStepOne';
import { users, PASSWORD } from '@test-data/users';
import { checkoutErrors } from '@test-data/checkout-errors';
import { products } from '@test-data/products';

test.describe('Checkout step one - customer information', () => {
  let inventoryPage: InventoryPage;
  let cartPage: CartPage;
  let checkoutStepOnePage: CheckoutStepOnePage;

  test.beforeEach(async ({ page }) => {
    const loginPage = new LoginPage(page);
    inventoryPage = new InventoryPage(page);
    cartPage = new CartPage(page);
    checkoutStepOnePage = new CheckoutStepOnePage(page);

    await loginPage.goto();
    await loginPage.login(users.standard, PASSWORD);

    await inventoryPage.addItemsToCart(products.backpack);
    await inventoryPage.goToCart();
    await cartPage.checkout();
  });

  test('loads checkout step one page', async ({ page }) => {
    await expect(page).toHaveURL(new RegExp(`${CheckoutStepOnePage.url}$`));
    await expect(checkoutStepOnePage.title).toHaveText('Checkout: Your Information');
  });

  test('navigates to checkout step two with valid information', async ({ page }) => {
    await checkoutStepOnePage.completeCheckoutInformation('John', 'Doe', '12345');

    await expect(page).toHaveURL(new RegExp('/checkout-step-two.html$'));
  });

  test('shows error when first name is missing', async () => {
    await checkoutStepOnePage.completeCheckoutInformation('', 'Doe', '12345');

    await expect(checkoutStepOnePage.error).toHaveText(checkoutErrors.firstNameRequired);
  });

  test('shows error when last name is missing', async () => {
    await checkoutStepOnePage.completeCheckoutInformation('John', '', '12345');

    await expect(checkoutStepOnePage.error).toHaveText(checkoutErrors.lastNameRequired);
  });

  test('shows error when postal code is missing', async () => {
    await checkoutStepOnePage.completeCheckoutInformation('John', 'Doe', '');

    await expect(checkoutStepOnePage.error).toHaveText(checkoutErrors.postalCodeRequired);
  });

  test('cancel navigates back to cart page', async ({ page }) => {
    await checkoutStepOnePage.cancel();

    await expect(page).toHaveURL(new RegExp('/cart.html$'));
  });
});
