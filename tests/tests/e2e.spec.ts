import { test, expect } from '@playwright/test';

const CLIENT_URL = 'http://localhost:3000'; 
const API_URL = 'http://localhost:8080';

test.describe('Testes E2E - Fluxos de Usuário', () => {

  test('Fluxo E2E: Usuário acessa o sistema e realiza cadastro', async ({ page, request }) => {
    const randomEmailE2E = `teste_${Date.now()}@teste4.com`;
    const senhaForte = 'Teste@teste4.com';
    
    await page.goto(CLIENT_URL);
    
    await page.getByRole('button', { name: 'Criar Conta' }).click();

    await page.getByRole('textbox', { name: 'seu@email.com' }).fill(randomEmailE2E);

    await page.getByRole('textbox', { name: '••••••••' }).first().fill(senhaForte);
    await page.getByRole('textbox', { name: '••••••••' }).nth(1).fill(senhaForte);

    await page.getByRole('main').getByRole('button', { name: 'Criar Conta' }).click();

    await page.waitForTimeout(3000);

    const confirmacaoDb = await request.post(`${API_URL}/auth/signin`, {
      data: { email: randomEmailE2E, password: senhaForte }
    });
    
    expect(confirmacaoDb.status()).toBe(200);
  });

  test('Fluxo E2E: Usuário realiza login e acessa o sistema', async ({ page }) => {
    const loginEmail = `login_e2e_${Date.now()}@fag.edu.br`;
    const senhaForte = 'Teste@teste4.com';
    
    await page.request.post(`${API_URL}/auth/signup`, {
      data: { email: loginEmail, password: senhaForte }
    });

    await page.goto(CLIENT_URL);
    
    await page.getByRole('button', { name: /entrar/i }).first().click();

    const inputs = page.locator('input');
    await inputs.nth(0).fill(loginEmail);
    await inputs.nth(1).fill(senhaForte);
    
    await inputs.nth(1).press('Enter');
    
    await expect(page.getByRole('button', { name: /sair/i })).toBeVisible({ timeout: 5000 });
  });

});