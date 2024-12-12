import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { MemoryRouter } from 'react-router-dom';
import Navbar from '../../components/NavBar';

describe('Navbar', () => {
  it('should render the Navbar component', () => {
    render(
      <MemoryRouter>
        <Navbar />
      </MemoryRouter>
    );

    // Verifica che il componente Navbar venga renderizzato correttamente
    expect(screen.getByText(/Home/i)).toBeInTheDocument();
  });

  it('should call navigate when a button is clicked', () => {
    const mockNavigate = jest.fn();
    render(
      <MemoryRouter>
        <Navbar />
      </MemoryRouter>
    );

    // Simula un click su un elemento della navbar che invoca la funzione di navigazione
    fireEvent.click(screen.getByText(/Home/i));

    // Verifica che la funzione mockNavigate sia stata chiamata
    expect(mockNavigate).toHaveBeenCalled();
  });
});
