import { isPasswordValid } from '../utils/password';
import { isEmailValid } from '../utils/email';

describe('1. Testes Unitários (Funções Simples)', () => {
  
  it('Deve reprovar uma senha que não atende aos requisitos mínimos', () => {
    const isValid = isPasswordValid('SenhaFraca');
    
    expect(isValid).toBe(false);
  });

  it('Deve aprovar um e-mail com formato válido', () => {
    const isValid = isEmailValid('aluno@fag.edu.br');
    
    expect(isValid).toBe(true);
  });

});