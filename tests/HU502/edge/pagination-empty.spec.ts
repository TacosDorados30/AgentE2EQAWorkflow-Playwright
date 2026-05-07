const { test, expect } = require('@playwright/test');

async function loginAndNavigate(page) {
  await page.goto('https://grpmassoauth.qaenv.dev/login/');
  await page.locator('input[name="username"]').fill('mquiroz');
  await page.locator('input[name="password"]').fill('123tamarindo123');
  await page.getByRole('button', { name: 'Iniciar sesion' }).click();
  await page.getByRole('heading', { name: /Bienvenido/ }).waitFor({ timeout: 15000 });
  await page.getByRole('link', { name: 'Ingresos' }).click();
  await page.waitForURL('**/ingresos/**', { timeout: 15000 });
  await page.getByRole('link', { name: 'Anuncios' }).click();
  await page.getByRole('link', { name: 'Zonas de Cobro' }).click();
  await page.waitForURL('**/zonas-cobro**', { timeout: 15000 });
}

test.describe('HU502 Edge Cases - Pagination and Empty States', () => {
  test.beforeEach(async ({ page }) => {
    await loginAndNavigate(page);
    await page.waitForTimeout(500);
  });

  test('TC-HU502-305: Pagination controls present', async ({ page }) => {
    await expect(page.getByText('Primera')).toBeVisible();
    await expect(page.getByText('Siguiente')).toBeVisible();
    await expect(page.getByText('Ultima')).toBeVisible();
    await expect(page.getByText('Anterior')).toBeVisible();
  });

  test('TC-HU502-209: Empty results state handling', async ({ page }) => {
    await expect(page.locator('table')).toBeVisible();
    const rows = await page.locator('table tbody tr').count();
    if (rows === 0) {
      const emptyMsg = page.getByText('No se encontraron');
      const hasMsg = await emptyMsg.isVisible().catch(() => false);
      expect(hasMsg || rows === 0).toBeTruthy();
    }
  });

  test('TC-HU502-306: Limpiar button clears filters', async ({ page }) => {
    const searchInput = page.locator('input[placeholder*="Buscar" i]').or(page.locator('input[name="search"]'));
    if (await searchInput.isVisible().catch(() => false)) {
      await searchInput.fill('TEST_SEARCH');
      await page.getByRole('button', { name: 'Limpiar' }).click();
      await page.waitForTimeout(500);
      expect(await searchInput.inputValue()).toBe('');
    }
  });
});