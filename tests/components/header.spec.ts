import { test, expect } from '@playwright/test';
import { Header } from '@components/header';
import { CartPage } from '@pages/cartPage';
import { InventoryPage } from '@pages/inventoryPage';

test.describe('Header component', () => {
  let header: Header;

  test.beforeEach(async ({ page }) => {
    header = new Header(page);
    await page.goto(CartPage.url);
  });

  test('should display the logo', async () => {
    await expect(header.logo).toBeVisible();
  });

  test('should open and close the menu', async () => {
    await header.openMenu();

    await expect(header.allItemsLink).toBeVisible();
    await expect(header.aboutLink).toBeVisible();

    await header.closeMenu();

    await expect(header.closeMenuButton).not.toBeVisible();
  });

  test('should click on the cart icon', async ({ page }) => {
    await header.clickCart();

    await expect(page).toHaveURL(CartPage.url);
  });

  test('menu links should be clickable', async ({ page }) => {
    await header.openMenu();
    await header.allItemsLink.click();
    await expect(page).toHaveURL(InventoryPage.url);

    await header.openMenu();
    await header.aboutLink.click();
    await expect(page).toHaveURL(/./);
  });
});
