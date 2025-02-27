import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { LoadingPage } from '../../components/LoadingPage';
import WeniLogo from '../../assets/weni-logo.svg';
import '@testing-library/jest-dom';

const mockProps = {
    title: 'Carregando...',
    description: 'Aguarde enquanto preparamos tudo para você.',
    color: 'rgb(0, 0, 255)',
};

describe('LoadingPage Component', () => {
    it('deve renderizar corretamente o título e a descrição', () => {
        render(<LoadingPage {...mockProps} />);

        expect(screen.getByText(mockProps.title)).toBeInTheDocument();
        expect(screen.getByText(mockProps.description)).toBeInTheDocument();
    });

    it('deve exibir o spinner com a cor especificada', () => {
        render(<LoadingPage {...mockProps} />);

        const spinner = screen.getByText('loading');
        expect(spinner).toBeInTheDocument();
        expect(spinner).toHaveStyle(`color: ${mockProps.color}`);
    });

    it('deve renderizar o logo corretamente', () => {
        render(<LoadingPage {...mockProps} />);

        const logo = screen.getByAltText('Weni Logo');
        expect(logo).toBeInTheDocument();
        expect(logo).toHaveAttribute('src', WeniLogo);
    });

    it('deve renderizar o texto do cabeçalho', () => {
        render(<LoadingPage {...mockProps} />);

        expect(screen.getByText('Weni agentic IA')).toBeInTheDocument();
    });
});
