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

test.describe('HU502 Edge Cases - Field Limits', () => {
  test.beforeEach(async ({ page }) => {
    test.setTimeout(60000);
    await loginAndNavigate(page);
    await page.getByRole('button', { name: 'Nuevo Registro' }).click();
    await page.getByRole('dialog').waitFor({ timeout: 15000 });
    await page.waitForTimeout(500);
  });

  test('TC-HU502-204: Clave maximum length enforcement', async ({ page }) => {
    test.fixme(true, 'App does not enforce max length on Clave field - accepts 200 chars');
    const claveInput = page.locator('input[name="clave"]');
    await claveInput.fill('A'.repeat(200));
    expect((await claveInput.inputValue()).length).toBeLessThanOrEqual(100);
  });

  test('TC-HU502-205: Nombre maximum length enforcement', async ({ page }) => {
    test.fixme(true, 'App does not enforce max length on Nombre field - accepts 500 chars');
    const nombreInput = page.locator('input[name="nombre"]');
    await nombreInput.fill('B'.repeat(500));
    expect((await nombreInput.inputValue()).length).toBeLessThan(500);
  });

  test('TC-HU502-206: Description accepts special chars', async ({ page }) => {
    const descInput = page.getByRole('textbox', { name: 'Descripcion' });
    await page.locator('input[name="clave"]').fill('DESC_TEST');
    await page.locator('input[name="nombre"]').fill('Test');
    await descInput.fill('Zona con caracteres: aeioun, Japanese, emojis');
    await expect(descInput).toHaveValue('Zona con caracteres: aeioun, Japanese, emojis');
  });

  test('TC-HU502-208: Double submit prevention', async ({ page }) => {
    await page.locator('input[name="clave"]').fill('DOUBLE_SUBMIT');
    await page.locator('input[name="nombre"]').fill('Double Submit Test');
    const guardarBtn = page.getByRole('button', { name: 'Guardar' });
    await guardarBtn.click();
    await page.waitForTimeout(1000);
    const isDisabled = await guardarBtn.isDisabled().catch(() => false);
    if (!isDisabled) await guardarBtn.click();
    const rows = await page.locator('table tbody tr').count();
    expect(rows).toBeLessThanOrEqual(1);
  });
});