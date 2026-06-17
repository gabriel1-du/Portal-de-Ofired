import '@testing-library/jest-dom';
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { BrowserRouter } from 'react-router-dom';

// Componente a testear
import CambiarTelefonoPantalla from '../../../pantallas/FormulariosConfig/CambiarTelefonoPantalla';

// Contexto
import { AuthContext } from '../../../context/AuthContext';

// Servicio a mockear
import * as usuariosService from '../../../servicios/usuariosService';

// MOCK DEL ROUTER (useNavigate)
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

// MOCK DEL SERVICIO
vi.mock('../../../servicios/usuariosService', () => ({
  updateUsuario: vi.fn(),
}));

const AuthWrapper = ({ children }) => (
  <AuthContext.Provider value={{ usuario: { idUsuario: 15, username: 'user@test.com' }, token: 'fake-token' }}>
    {children}
  </AuthContext.Provider>
);

describe('Test del Componente CambiarTelefonoPantalla', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    window.alert = vi.fn();
    usuariosService.updateUsuario.mockResolvedValue({});
  });

  it('Debe mostrar error si el formato del teléfono es inválido', async () => {
    render(
      <BrowserRouter>
        <AuthWrapper><CambiarTelefonoPantalla /></AuthWrapper>
      </BrowserRouter>
    );
    
    fireEvent.change(screen.getByLabelText(/Ingrese nuevo teléfono/i), { target: { value: 'abcde' } });
    fireEvent.change(screen.getByLabelText(/Ingrese nuevamente/i), { target: { value: 'abcde' } });
    fireEvent.click(screen.getByRole('button', { name: /Cambiar Teléfono/i }));

    expect(screen.getByText('El formato del teléfono no es válido. Ingrese solo números (ej: +56912345678).')).toBeInTheDocument();
    expect(usuariosService.updateUsuario).not.toHaveBeenCalled();
  });

  it('Debe permitir cambiar el teléfono exitosamente', async () => {
    render(
      <BrowserRouter>
        <AuthWrapper><CambiarTelefonoPantalla /></AuthWrapper>
      </BrowserRouter>
    );
    
    fireEvent.change(screen.getByLabelText(/Ingrese nuevo teléfono/i), { target: { value: '+56911223344' } });
    fireEvent.change(screen.getByLabelText(/Ingrese nuevamente/i), { target: { value: '+56911223344' } });
    fireEvent.click(screen.getByRole('button', { name: /Cambiar Teléfono/i }));

    await waitFor(() => {
      expect(usuariosService.updateUsuario).toHaveBeenCalledWith(15, { numeroTelef: '+56911223344' }, 'fake-token');
    });
    
    expect(window.alert).toHaveBeenCalledWith('Teléfono actualizado exitosamente.');
    expect(mockNavigate).toHaveBeenCalledWith('/configuracion');
  });
});