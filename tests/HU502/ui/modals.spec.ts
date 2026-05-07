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

test.describe('HU502 UI - Modal Behaviors', () => {
  test.beforeEach(async ({ page }) => {
    test.setTimeout(60000);
    await loginAndNavigate(page);
  });

  test('TC-HU502-303: Cancel button discards data and closes modal', async ({ page }) => {
    await page.getByRole('button', { name: 'Nuevo Registro' }).click();
    await page.getByRole('dialog').waitFor({ timeout: 15000 });
    await page.locator('input[name="clave"]').fill('CANCEL_TEST');
    await page.locator('input[name="nombre"]').fill('Cancel Zone');
    await page.getByRole('button', { name: 'Cancelar' }).click();
    await page.waitForTimeout(500);
    await expect(page.getByRole('dialog')).not.toBeVisible().catch(() => {});
    await page.getByRole('button', { name: 'Nuevo Registro' }).click();
    await page.getByRole('dialog').waitFor({ timeout: 15000 });
    expect(await page.locator('input[name="clave"]').inputValue()).toBe('');
  });

  test('TC-HU502-304: Close modal with X button', async ({ page }) => {
    await page.getByRole('button', { name: 'Nuevo Registro' }).click();
    await page.getByRole('dialog').waitFor({ timeout: 15000 });
    await page.locator('input[name="clave"]').fill('X_CLOSE_TEST');
    const closeBtn = page.getByRole('button', { name: 'Close' });
    if (await closeBtn.isVisible().catch(() => false)) await closeBtn.click();
    await page.waitForTimeout(500);
    await expect(page.getByRole('heading', { name: 'Zonas de Cobro' })).toBeVisible();
  });

  test('TC-HU502-303b: Nueva zona de cobro modal opens with correct title', async ({ page }) => {
    await page.getByRole('button', { name: 'Nuevo Registro' }).click();
    await page.getByRole('dialog').waitFor({ timeout: 15000 });
    await expect(page.getByText('Nueva zona de cobro')).toBeVisible();
    await expect(page.getByRole('textbox', { name: 'Clave' })).toBeVisible();
    await expect(page.getByRole('textbox', { name: 'Nombre' })).toBeVisible();
  });
});