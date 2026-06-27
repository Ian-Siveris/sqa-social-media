import { render, screen } from '@testing-library/react';
import Button from '../components/Button';
import Input from '../components/Input';

describe('2. Testes Unitários (Componentes)', () => {

  it('Deve renderizar o componente Button com o texto correto', () => {
    render(<Button>Entrar no Sistema</Button>);
    
    const botao = screen.getByText('Entrar no Sistema');
    expect(botao).toBeInTheDocument();
  });

  it('Deve renderizar o componente Input com o placeholder correto', () => {
    render(<Input placeholder="Digite seu e-mail" name="email" />);
    
    const input = screen.getByPlaceholderText('Digite seu e-mail');
    expect(input).toBeInTheDocument();
  });

});