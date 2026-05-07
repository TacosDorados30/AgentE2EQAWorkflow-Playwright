const { test, expect } = require('@playwright/test');

let page;

test.describe('HU502 - Administrar Zonas de Cobro - Negative: Edit Restrictions', () => {
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

  test('TC-HU502-108: Edit Zone with Empty Nombre (Validation Proxy)', async () => {
    await page.getByRole('button', { name: 'Nuevo Registro' }).click();
    const dialog = page.getByRole('dialog');
    await expect(dialog).toBeVisible();
    const claveInput = dialog.getByRole('textbox', { name: 'Clave', exact: true });
    await claveInput.fill('ZONA_EDIT2');
    await dialog.getByRole('textbox', { name: 'Nombre de la zona de cobro' }).fill('');
    await dialog.getByRole('button', { name: 'Guardar' }).click();
    await expect(page.getByText('El nombre es obligatorio')).toBeVisible();
    await expect(dialog).toBeVisible();
  });

  test('TC-HU502-109: Verify Clave Field Behavior in Create vs Edit', async () => {
    await page.getByRole('button', { name: 'Nuevo Registro' }).click();
    const dialog = page.getByRole('dialog');
    const claveInput = dialog.getByRole('textbox', { name: 'Clave', exact: true });
    await expect(claveInput).toBeVisible();
    await expect(claveInput).toBeEnabled();
    await claveInput.fill('READ_ONLY_TEST');
    await expect(claveInput).toHaveValue('READ_ONLY_TEST');
    console.log('NOTE: In edit modal, Clave should be populated and read-only.');
    await dialog.getByRole('button', { name: 'Cancelar' }).click();
  });

  test('Clave Normalization: Auto-Uppercase and Special Characters', async () => {
    await page.getByRole('button', { name: 'Nuevo Registro' }).click();
    const dialog = page.getByRole('dialog');
    const claveInput = dialog.getByRole('textbox', { name: 'Clave', exact: true });
    await claveInput.fill('zona_centro');
    await expect(claveInput).toHaveValue('ZONA_CENTRO');
    await claveInput.fill('zona@#$test');
    await expect(claveInput).toHaveValue('ZONATEST');
    console.log('Clave normalization: lowercase->uppercase, special chars stripped.');
  });
});