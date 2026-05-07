const { test, expect } = require('@playwright/test');

async function navigateToZonasCobro(page) {
  await page.goto('https://grpmassoauth.qaenv.dev/login/');
  await page.locator('input[name="username"]').fill('mquiroz');
  await page.locator('input[name="password"]').fill('123tamarindo123');
  await page.getByRole('button', { name: 'Iniciar sesion' }).click();
  await page.getByRole('heading', { name: /Bienvenido/ }).waitFor({ timeout: 15000 });
  await page.getByRole('link', { name: /Ingresos/ }).click();
  await page.waitForURL('**/ingresos/**', { timeout: 15000 });
  await page.getByRole('link', { name: 'Anuncios' }).click();
  await page.waitForTimeout(500);
  await page.getByRole('link', { name: 'Zonas de Cobro' }).click();
  await page.waitForURL('**/zonas-cobro**', { timeout: 15000 });
  await page.getByTitle('Filtros de busqueda').getByRole('button').click();
  await expect(page.getByRole('textbox', { name: 'Ingrese clave o nombre...' })).toBeVisible();
}

test.describe('HU502 - Administrar Zonas de Cobro - Search & Filter', () => {
  test.beforeEach(async ({ page }) => {
    test.setTimeout(60000);
    await navigateToZonasCobro(page);
  });

  test('TC-HU502-006: Search Zone by Key Text', async ({ page }) => {
    const searchBox = page.getByRole('textbox', { name: 'Ingrese clave o nombre...' });
    await searchBox.fill('ZONA_A');
    await page.getByRole('button', { name: 'Filtrar' }).click();
    await expect(page.getByRole('heading', { name: 'Resultados' })).toBeVisible();
    await expect(page.getByRole('columnheader', { name: 'Clave' })).toBeVisible();
  });

  test('TC-HU502-007: Search Zone by Name Text', async ({ page }) => {
    const searchBox = page.getByRole('textbox', { name: 'Ingrese clave o nombre...' });
    await searchBox.fill('Alpha');
    await page.getByRole('button', { name: 'Filtrar' }).click();
    await expect(page.getByRole('heading', { name: 'Resultados' })).toBeVisible();
  });

  test('TC-HU502-008: Filter by Active Status (Activas)', async ({ page }) => {
    await expect(page.getByText('Activas').first()).toBeVisible();
    await page.getByRole('button', { name: 'Filtrar' }).click();
    await expect(page.getByRole('heading', { name: 'Resultados' })).toBeVisible();
  });

  test('TC-HU502-009: Filter by Archived Status (Archivadas)', async ({ page }) => {
    const statusContainer = page.locator('div').filter({ has: page.getByText('Estatus') }).locator('[class*="container"]').last();
    await statusContainer.click();
    await expect(page.locator('[role="listbox"]')).toBeVisible();
    await page.locator('[role="option"]', { hasText: 'Archivadas' }).click();
    await page.getByRole('button', { name: 'Filtrar' }).click();
  });

  test('TC-HU502-010: Filter by All Statuses (Todas)', async ({ page }) => {
    const statusContainer = page.locator('div').filter({ has: page.getByText('Estatus') }).locator('[class*="container"]').last();
    await statusContainer.click();
    await expect(page.locator('[role="listbox"]')).toBeVisible();
    await page.locator('[role="option"]', { hasText: 'Todas' }).click();
    await page.getByRole('button', { name: 'Filtrar' }).click();
  });

  test('TC-HU502-306: Clear Filters with Limpiar Button', async ({ page }) => {
    const searchBox = page.getByRole('textbox', { name: 'Ingrese clave o nombre...' });
    await searchBox.fill('ZONA_TEMP');
    await page.getByRole('button', { name: 'Filtrar' }).click();
    await page.getByRole('button', { name: 'Limpiar' }).click();
    await expect(searchBox).toHaveValue('');
    await expect(page.getByText('Activas').first()).toBeVisible();
  });
});