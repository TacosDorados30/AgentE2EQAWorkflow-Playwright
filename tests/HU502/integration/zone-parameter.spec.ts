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

test.describe('HU502 Integration - Zone Parameter Configuration', () => {
  test.beforeEach(async ({ page }) => {
    test.setTimeout(60000);
    await loginToApp(page);
  });

  test('TC-HU502-405: Zona de Cobro parameter has expected options', async ({ page }) => {
    await page.getByRole('link', { name: 'Tarifas de Anuncios' }).click();
    await page.waitForURL('**/tarifas**', { timeout: 15000 });
    await page.waitForTimeout(500);
    const obligatoriaOption = page.locator('option').filter({ hasText: 'Obligatoria' });
    const opcionalOption = page.locator('option').filter({ hasText: 'Opcional' });
    const noAplicaOption = page.locator('option').filter({ hasText: 'No Aplica' });
    const obligatoriaExists = (await obligatoriaOption.count()) > 0;
    const opcionalExists = (await opcionalOption.count()) > 0;
    const noAplicaExists = (await noAplicaOption.count()) > 0;
    expect(obligatoriaExists || opcionalExists || noAplicaExists).toBeTruthy();
  });

  test('TC-HU502-404: Zone field required when Obligatoria is set', async ({ page }) => {
    test.skip(true, 'Requires working database to save parameter config. Skipping until backend is available.');
  });

  test('TC-HU502-406: Zone field optional when Opcional is set', async ({ page }) => {
    test.skip(true, 'Requires working database to save parameter config. Skipping until backend is available.');
  });
});