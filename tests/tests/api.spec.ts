import { test, expect } from '@playwright/test';

const API_URL = 'http://localhost:8080'; 
let randomEmail = '';

test.describe.serial('Testes de API - Autenticação', () => {

  test.beforeAll(() => {
    randomEmail = `usuario_${Date.now()}@fag.edu.br`;
  });

  test('Deve cadastrar um novo usuário com sucesso', async ({ request }) => {
    const response = await request.post(`${API_URL}/auth/signup`, {
      data: { email: randomEmail, password: 'SenhaForte123!' }
    });
    expect(response.ok()).toBeTruthy();
  });

  test('Deve bloquear cadastro com e-mail já existente', async ({ request }) => {
    const response = await request.post(`${API_URL}/auth/signup`, {
      data: { email: randomEmail, password: 'SenhaForte123!' }
    });
    expect(response.status()).toBe(409); 
  });

  test('Deve realizar login com credenciais válidas', async ({ request }) => {
    const response = await request.post(`${API_URL}/auth/signin`, {
      data: { email: randomEmail, password: 'SenhaForte123!' }
    });
    expect(response.status()).toBe(200);
  });

  test('Deve falhar ao tentar logar com senha incorreta', async ({ request }) => {
    const response = await request.post(`${API_URL}/auth/signin`, {
      data: { email: randomEmail, password: 'SenhaErrada999!' }
    });
    expect(response.ok()).toBeFalsy(); 
  });

});