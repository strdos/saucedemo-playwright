import { test, expect } from '@playwright/test';
import { LoginPage } from '@pages/loginPage';
import { InventoryPage } from '@pages/inventoryPage';
import { users, PASSWORD } from '@test-data/users';
import { loginErrors } from '@test-data/login-errors';

test.describe('Login - credential validation (standard user)', () => {
    let loginPage: LoginPage;

    test.beforeEach(async ({ page }) => {
        loginPage = new LoginPage(page);
        await loginPage.goto();
    });

    test('logs in successfully with valid standard_user credentials', async ({ page }) => {
        const inventoryPage = new InventoryPage(page);
        
        await loginPage.login(users.standard, PASSWORD);

        await expect(page).toHaveURL(new RegExp(InventoryPage.url));
        await expect(inventoryPage.title).toHaveText('Products');
        await expect(inventoryPage.inventoryItems.first()).toBeVisible();
    });

    test('shows error for invalid username with valid password', async () => {
        await loginPage.username.fill('invalid_user');
        await loginPage.password.fill(PASSWORD);
        await loginPage.loginButton.click();

        await expect(loginPage.error).toBeVisible();
        await expect(loginPage.error).toHaveText(loginErrors.invalidCredentials
        );
    });

    test('shows error for valid username with invalid password', async () => {
        await loginPage.username.fill(users.standard);
        await loginPage.password.fill('invalid_password');
        await loginPage.loginButton.click();

        await expect(loginPage.error).toBeVisible();
        await expect(loginPage.error).toHaveText(loginErrors.invalidCredentials
        );
    });

    test('shows error for empty username and password', async () => {
        await loginPage.loginButton.click();

        await expect(loginPage.error).toBeVisible();
        await expect(loginPage.error).toHaveText(loginErrors.usernameRequired);
    });
});
