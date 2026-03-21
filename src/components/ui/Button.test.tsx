import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import Button from './Button';

describe('Button Component', () => {
    it('renteriza o botão corretamente com o texto passado', () => {
        render(<Button>Clique aqui</Button>);
        const button = screen.getByRole('button', { name: /clique aqui/i });
        expect(button).toBeInTheDocument();
    });

    it('aplica as classes de estilo para a variante primary por padrão', () => {
        render(<Button>Salvar</Button>);
        const button = screen.getByRole('button', { name: /salvar/i });
        expect(button).toHaveClass('bg-twitter-blue');
    });

    it('desabilita o botão e mostra o loading spinner quando isLoading é true', () => {
        render(<Button isLoading>Carregando</Button>);
        const button = screen.getByRole('button', { name: /carregando/i });
        expect(button).toBeDisabled();
        // O spinner tem um role de svg na renderização padrão, testando pela tag
        const svg = document.querySelector('svg');
        expect(svg).toBeInTheDocument();
        expect(svg).toHaveClass('animate-spin');
    });

    it('chama a função onClick ao ser clicado', async () => {
        const handleClick = vi.fn();
        const user = userEvent.setup();
        
        render(<Button onClick={handleClick}>Enviar</Button>);
        const button = screen.getByRole('button', { name: /enviar/i });
        
        await user.click(button);
        expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it('não chama onCLick se estiver desabilitado', async () => {
        const handleClick = vi.fn();
        const user = userEvent.setup();
        
        render(<Button onClick={handleClick} disabled>Enviar</Button>);
        const button = screen.getByRole('button', { name: /enviar/i });
        
        await user.click(button);
        expect(handleClick).not.toHaveBeenCalled();
    });
});
