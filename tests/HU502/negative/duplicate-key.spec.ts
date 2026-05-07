const { test, expect } = require('@playwright/test');

let page;

test.describe('HU502 - Administrar Zonas de Cobro - Negative: Duplicate Key/Name', () => {
  test.beforeEach(async ({ page: testPage }) => {
    page = testPage;
    await page.goto('https://grpmassoauth.qaenv.dev/login/');
    await page.locator('input[name="username"]').fill('mquiroz');
    await page.locator('input[name="password"]').fill('123tamarindo123');
    await page.getByRole('button', { name: 'Iniciar sesion' }).click();
    await page.getByRole('heading', { name: /Bienvenido/ }).waitFor({ timeout: 15000 });
    await page.getByRole('link', { name: /Ingresos/ }).click();
    await page.waitForURL('**/ingresos/**');
    await page.getByRole('link', { name: 'Anuncios' }).click();
    await page.getByRole('link', { name: 'Zonas de Cobro' }).click();
    await page.waitForURL('**/zonas-cobro**');
  });

  test('TC-HU502-104: Attempt Duplicate Key Creation', async () => {
    await page.getByRole('button', { name: 'Nuevo Registro' }).click();
    const dialog = page.getByRole('dialog');
    await expect(dialog).toBeVisible();
    const claveInput = dialog.getByRole('textbox', { name: 'Clave', exact: true });
    await claveInput.fill('ZONA_DUP');
    await dialog.getByRole('textbox', { name: 'Nombre de la zona de cobro' }).fill('Zona Duplicada Key');
    await dialog.getByRole('button', { name: 'Guardar' }).click();
    await expect(page.getByText('Error al guardar la zona de cobro')).toBeVisible();
    await dialog.getByRole('button', { name: 'Close' }).first().click();
    await expect(dialog).not.toBeVisible();
    await page.getByRole('button', { name: 'Nuevo Registro' }).click();
    const dialog2 = page.getByRole('dialog');
    const claveInput2 = dialog2.getByRole('textbox', { name: 'Clave', exact: true });
    await claveInput2.fill('ZONA_DUP');
    await dialog2.getByRole('textbox', { name: 'Nombre de la zona de cobro' }).fill('Different Name');
    await dialog2.getByRole('button', { name: 'Guardar' }).click();
    await expect(page.getByText('Error al guardar la zona de cobro')).toBeVisible();
    await expect(dialog2).toBeVisible();
  });

  test('TC-HU502-105: Attempt Duplicate Name Creation', async () => {
    await page.getByRole('button', { name: 'Nuevo Registro' }).click();
    const dialog = page.getByRole('dialog');
    await dialog.getByRole('textbox', { name: 'Clave', exact: true }).fill('KEY_ONE');
    await dialog.getByRole('textbox', { name: 'Nombre de la zona de cobro' }).fill('Zona Unica');
    await dialog.getByRole('button', { name: 'Guardar' }).click();
    await expect(page.getByText('Error al guardar la zona de cobro')).toBeVisible();
    await dialog.getByRole('button', { name: 'Close' }).first().click();
    await page.getByRole('button', { name: 'Nuevo Registro' }).click();
    const dialog2 = page.getByRole('dialog');
    await dialog2.getByRole('textbox', { name: 'Clave', exact: true }).fill('KEY_TWO');
    await dialog2.getByRole('textbox', { name: 'Nombre de la zona de cobro' }).fill('Zona Unica');
    await dialog2.getByRole('button', { name: 'Guardar' }).click();
    await expect(page.getByText('Error al guardar la zona de cobro')).toBeVisible();
  });
});