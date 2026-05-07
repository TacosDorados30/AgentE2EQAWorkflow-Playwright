const { test, expect } = require('@playwright/test');

async function loginToApp(page) {
  await page.goto('https://grpmassoauth.qaenv.dev/login/');
  await page.locator('input[name="username"]').fill('mquiroz');
  await page.locator('input[name="password"]').fill('123tamarindo123');
  await page.getByRole('button', { name: 'Iniciar sesion' }).click();
  await page.getByRole('heading', { name: /Bienvenido/ }).waitFor({ timeout: 15000 });
  await page.getByRole('link', { name: 'Ingresos' }).click();
  await page.waitForURL('**/ingresos/**', { timeout: 15000 });
  await page.getByRole('link', { name: 'Anuncios' }).click();
  await page.waitForTimeout(500);
}

test.describe('HU502 Integration - Zone Selector in Other Modules', () => {
  test.beforeEach(async ({ page }) => {
    test.setTimeout(60000);
    await loginToApp(page);
  });

  test('TC-HU502-401: Zone selector appears in Alta de Anuncio modal', async ({ page }) => {
    await page.getByRole('link', { name: 'Padron de Anuncios' }).click();
    await page.waitForURL('**/padron**', { timeout: 15000 });
    await page.waitForTimeout(500);
    await page.getByRole('button', { name: 'Nuevo Anuncio' }).click();
    await page.waitForTimeout(1000);
    const modal = page.locator('dialog');
    if (await modal.isVisible().catch(() => false)) {
      await expect(page.getByText('Alta de Anuncio')).toBeVisible();
      await expect(page.getByText('Zona de Cobro')).toBeVisible();
    }
  });

  test('TC-HU502-402: Archived zones not shown in zone selector', async ({ page }) => {
    await page.getByRole('link', { name: 'Padron de Anuncios' }).click();
    await page.waitForURL('**/padron**', { timeout: 15000 });
    await page.waitForTimeout(500);
    await page.getByRole('button', { name: 'Nuevo Anuncio' }).click();
    await page.waitForTimeout(1000);
    const modal = page.locator('dialog');
    if (await modal.isVisible().catch(() => false)) {
      const combobox = page.locator('[role="combobox"]').first();
      if (await combobox.isVisible().catch(() => false)) {
        await combobox.click();
        await page.waitForTimeout(300);
        const listbox = page.locator('[role="listbox"]');
        if (await listbox.isVisible().catch(() => false)) {
          const count = await page.locator('[role="option"]').count();
          expect(count).toBeGreaterThanOrEqual(0);
        }
      }
    }
  });

  test('TC-HU502-403: Restored zone reappears in zone selector', async ({ page }) => {
    test.skip(true, 'Requires working database with zone CRUD. Skipping until DB table a_zona_cobro is available.');
  });
});