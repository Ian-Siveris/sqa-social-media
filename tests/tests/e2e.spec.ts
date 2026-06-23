import { test, expect } from '@playwright/test';

const CLIENT_URL = 'http://localhost:3000'; 
const API_URL = 'http://localhost:8080';

test.describe('Testes E2E - Fluxos de Usuário', () => {

  // TESTE 1: CADASTRO VISUAL (Agora com a Confirmação de Senha!)
  test('Fluxo E2E: Usuário acessa o sistema e realiza cadastro', async ({ page, request }) => {
    // Usando uma senha forte que sabemos que o backend aceita (do seu codegen)
    const randomEmailE2E = `teste_${Date.now()}@teste4.com`;
    const senhaForte = 'Teste@teste4.com';
    
    await page.goto(CLIENT_URL);
    
    // 1. Clica na aba de criar conta
    await page.getByRole('button', { name: 'Criar Conta' }).click();

    // 2. Preenche o e-mail
    await page.getByRole('textbox', { name: 'seu@email.com' }).fill(randomEmailE2E);

    // 3. Preenche a Senha e a Confirmação de Senha (O segredo revelado!)
    await page.getByRole('textbox', { name: '••••••••' }).first().fill(senhaForte);
    await page.getByRole('textbox', { name: '••••••••' }).nth(1).fill(senhaForte);

    // 4. Clica no botão final de enviar
    await page.getByRole('main').getByRole('button', { name: 'Criar Conta' }).click();

    // 5. Dá 3 segundos para o Java salvar no banco
    await page.waitForTimeout(3000);

    // 6. Validação Híbrida: Testa na API se o usuário realmente foi criado!
    const confirmacaoDb = await request.post(`${API_URL}/auth/signin`, {
      data: { email: randomEmailE2E, password: senhaForte }
    });
    
    // Tem que retornar 200 (Sucesso)
    expect(confirmacaoDb.status()).toBe(200);
  });

  // TESTE 2: LOGIN VISUAL (Intacto, já estava passando lindo)
  test('Fluxo E2E: Usuário realiza login e acessa o sistema', async ({ page }) => {
    const loginEmail = `login_e2e_${Date.now()}@fag.edu.br`;
    const senhaForte = 'Teste@teste4.com';
    
    // Cadastra o cara no banco antes
    await page.request.post(`${API_URL}/auth/signup`, {
      data: { email: loginEmail, password: senhaForte }
    });

    await page.goto(CLIENT_URL);
    
    // Abre o modal
    await page.getByRole('button', { name: /entrar/i }).first().click();

    // Preenche
    const inputs = page.locator('input');
    await inputs.nth(0).fill(loginEmail);
    await inputs.nth(1).fill(senhaForte);
    
    // Aperta 'Enter'
    await inputs.nth(1).press('Enter');
    
    // Espera o botão de sair aparecer
    await expect(page.getByRole('button', { name: /sair/i })).toBeVisible({ timeout: 5000 });
  });

});