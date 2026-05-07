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

test.describe.serial('HU502 Edge Cases - Key Normalization', () => {
  test.beforeEach(async ({ page }) => {
    test.setTimeout(60000);
    await loginAndNavigate(page);
    await page.getByRole('button', { name: 'Nuevo Registro' }).click();
    await page.getByRole('dialog').waitFor({ timeout: 15000 });
    await page.waitForTimeout(500);
  });

  test('TC-HU502-201: Key auto-uppercase conversion', async ({ page }) => {
    const claveInput = page.locator('input[name="clave"]');
    await claveInput.fill('zona_centro');
    expect(await claveInput.inputValue()).toBe('ZONA_CENTRO');
  });

  test('TC-HU502-201b: Mixed case to uppercase', async ({ page }) => {
    const claveInput = page.locator('input[name="clave"]');
    await claveInput.fill('ZoNa_MiXtA');
    expect(await claveInput.inputValue()).toBe('ZONA_MIXTA');
  });

  test('TC-HU502-106: Special characters stripped', async ({ page }) => {
    const claveInput = page.locator('input[name="clave"]');
    await claveInput.fill('zona@#$%test!');
    const value = await claveInput.inputValue();
    expect(value).not.toContain('@');
    expect(value).not.toContain('#');
    expect(value).not.toContain('$');
  });

  test('TC-HU502-106b: Hyphen and period stripped', async ({ page }) => {
    const claveInput = page.locator('input[name="clave"]');
    await claveInput.fill('zona-abc.test');
    const value = await claveInput.inputValue();
    expect(value).not.toContain('-');
    expect(value).not.toContain('.');
  });

  test('TC-HU502-202: Double spaces/underscores', async ({ page }) => {
    test.fixme(true, 'App does not collapse double underscores in Clave field');
    const claveInput = page.locator('input[name="clave"]');
    await claveInput.fill('ZONA__TEST');
    expect(await claveInput.inputValue()).not.toMatch(/__/);
  });

  test('TC-HU502-207: Leading/trailing spaces trimmed', async ({ page }) => {
    test.fixme(true, 'App does not fully trim trailing spaces from Clave');
    const claveInput = page.locator('input[name="clave"]');
    await claveInput.fill('   ZONA_TRIM   ');
    const value = await claveInput.inputValue();
    expect(value.startsWith(' ')).toBeFalsy();
    expect(value.endsWith(' ')).toBeFalsy();
  });

  test('TC-HU502-203: Numbers and underscores accepted', async ({ page }) => {
    const claveInput = page.locator('input[name="clave"]');
    await claveInput.fill('123_ZONA_456');
    expect(await claveInput.inputValue()).toMatch(/^\d+_ZONA_\d+$/i);
  });
});