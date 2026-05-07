const { test, expect } = require('@playwright/test');

let page;

test.describe('HU502 - Administrar Zonas de Cobro - Negative: Validation', () => {
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
    await page.getByRole('button', { name: 'Nuevo Registro' }).click();
  });

  test('TC-HU502-101: Create Zone with Empty Clave', async () => {
    const dialog = page.getByRole('dialog');
    await expect(dialog).toBeVisible();
    await dialog.getByRole('textbox', { name: 'Nombre de la zona de cobro' }).fill('Test Zone');
    await dialog.getByRole('button', { name: 'Guardar' }).click();
    await expect(page.getByText('La clave es obligatoria')).toBeVisible();
    await expect(dialog).toBeVisible();
  });

  test('TC-HU502-102: Create Zone with Empty Nombre', async () => {
    const dialog = page.getByRole('dialog');
    await dialog.getByRole('textbox', { name: 'Clave', exact: true }).fill('TEST_001');
    await dialog.getByRole('button', { name: 'Guardar' }).click();
    await expect(page.getByText('El nombre es obligatorio')).toBeVisible();
    await expect(dialog).toBeVisible();
  });

  test('TC-HU502-103: Create Zone with Both Fields Empty', async () => {
    const dialog = page.getByRole('dialog');
    await dialog.getByRole('button', { name: 'Guardar' }).click();
    await expect(page.getByText('La clave es obligatoria')).toBeVisible();
    await expect(page.getByText('El nombre es obligatorio')).toBeVisible();
    await expect(dialog).toBeVisible();
  });

  test('Validation: Cancel button closes modal and discards data', async () => {
    const dialog = page.getByRole('dialog');
    await dialog.getByRole('textbox', { name: 'Clave', exact: true }).fill('CANCEL_TEST');
    await dialog.getByRole('button', { name: 'Cancelar' }).click();
    await expect(dialog).not.toBeVisible();
    await page.getByRole('button', { name: 'Nuevo Registro' }).click();
    const newDialog = page.getByRole('dialog');
    await expect(newDialog.getByRole('textbox', { name: 'Clave', exact: true })).toHaveValue('');
  });
});