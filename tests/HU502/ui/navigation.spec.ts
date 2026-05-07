const { test, expect } = require('@playwright/test');

async function login(page) {
  await page.goto('https://grpmassoauth.qaenv.dev/login/');
  await page.locator('input[name="username"]').fill('mquiroz');
  await page.locator('input[name="password"]').fill('123tamarindo123');
  await page.getByRole('button', { name: 'Iniciar sesion' }).click();
  await page.getByRole('heading', { name: /Bienvenido/ }).waitFor({ timeout: 15000 });
}

test.describe('HU502 UI - Navigation', () => {
  test('TC-HU502-301: Sidebar navigation to Zonas de Cobro', async ({ page }) => {
    await login(page);
    await page.getByRole('link', { name: 'Ingresos' }).click();
    await page.waitForURL('**/ingresos/**', { timeout: 15000 });
    await page.getByRole('link', { name: 'Anuncios' }).click();
    await page.getByRole('link', { name: 'Zonas de Cobro' }).click();
    await page.waitForURL('**/zonas-cobro**', { timeout: 15000 });
    await expect(page).toHaveURL(/zonas-cobro/);
    await expect(page.getByRole('heading', { name: 'Zonas de Cobro' })).toBeVisible();
  });

  test('TC-HU502-302: Filter toggle collapse and expand', async ({ page }) => {
    await login(page);
    await page.getByRole('link', { name: 'Ingresos' }).click();
    await page.waitForURL('**/ingresos/**', { timeout: 15000 });
    await page.getByRole('link', { name: 'Anuncios' }).click();
    await page.getByRole('link', { name: 'Zonas de Cobro' }).click();
    await page.waitForURL('**/zonas-cobro**', { timeout: 15000 });
    await page.waitForTimeout(500);
    await expect(page.getByText('Filtros de busqueda')).toBeVisible();
  });

  test('TC-HU502-307: Table columns visible', async ({ page }) => {
    await login(page);
    await page.getByRole('link', { name: 'Ingresos' }).click();
    await page.waitForURL('**/ingresos/**', { timeout: 15000 });
    await page.getByRole('link', { name: 'Anuncios' }).click();
    await page.getByRole('link', { name: 'Zonas de Cobro' }).click();
    await page.waitForURL('**/zonas-cobro**', { timeout: 15000 });
    await page.waitForTimeout(500);
    await expect(page.locator('table')).toBeVisible();
    await expect(page.getByText('Clave')).toBeVisible();
    await expect(page.getByText('Nombre')).toBeVisible();
    await expect(page.getByText('Estatus')).toBeVisible();
    await expect(page.getByText('Acciones')).toBeVisible();
  });

  test('TC-HU502-307b: Page title and subtitle', async ({ page }) => {
    await login(page);
    await page.getByRole('link', { name: 'Ingresos' }).click();
    await page.waitForURL('**/ingresos/**', { timeout: 15000 });
    await page.getByRole('link', { name: 'Anuncios' }).click();
    await page.getByRole('link', { name: 'Zonas de Cobro' }).click();
    await page.waitForURL('**/zonas-cobro**', { timeout: 15000 });
    await expect(page.getByRole('heading', { name: 'Zonas de Cobro' })).toBeVisible();
    await expect(page.getByText('Listado y administracion')).toBeVisible();
  });
});