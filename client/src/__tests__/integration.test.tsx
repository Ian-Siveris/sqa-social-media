import { render, screen } from '@testing-library/react';
import { AuthProvider } from '../contexts/AuthContext';
import Header from '../components/Header';

jest.mock('next/navigation', () => ({
  useRouter: () => ({ push: jest.fn() })
}));

describe('3. Testes de Integração (Telas e Fluxos)', () => {

  it('Deve exibir os botões de "Entrar" e "Criar conta" para um visitante deslogado', () => {
    render(
      <AuthProvider>
        <Header />
      </AuthProvider>
    );
    
    expect(screen.getByText(/entrar/i)).toBeInTheDocument();
    expect(screen.getByText(/criar conta/i)).toBeInTheDocument();
  });

  it('CAPTURA DE BUG: Deve manter a sessão do usuário após recarregar a página (F5)', () => {
    window.localStorage.setItem('token', 'fake-jwt-token');
    
    render(
      <AuthProvider>
        <Header />
      </AuthProvider>
    );

    expect(screen.getByText(/sair/i)).toBeInTheDocument();
  });

});