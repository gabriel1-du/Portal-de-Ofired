import '@testing-library/jest-dom';
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { BrowserRouter } from 'react-router-dom';

// Componente a testear
import CambiarCorreoPantalla from '../../../pantallas/FormulariosConfig/CambiarCorreoPantalla';

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
  <AuthContext.Provider value={{ usuario: { idUsuario: 10, username: 'user@test.com' }, token: 'fake-token' }}>
    {children}
  </AuthContext.Provider>
);

describe('Test del Componente CambiarCorreoPantalla', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    window.alert = vi.fn();
    usuariosService.updateUsuario.mockResolvedValue({});
  });

  it('Debe mostrar error si los correos no coinciden', async () => {
    render(
      <BrowserRouter>
        <AuthWrapper><CambiarCorreoPantalla /></AuthWrapper>
      </BrowserRouter>
    );
    
    fireEvent.change(screen.getByLabelText(/Ingrese nuevo correo/i), { target: { value: 'nuevo@correo.com' } });
    fireEvent.change(screen.getByLabelText(/Ingrese nuevamente/i), { target: { value: 'diferente@correo.com' } });
    fireEvent.click(screen.getByRole('button', { name: /Cambiar Correo/i }));

    expect(screen.getByText('Los correos electrónicos no coinciden.')).toBeInTheDocument();
    expect(usuariosService.updateUsuario).not.toHaveBeenCalled();
  });

  it('Debe permitir cambiar el correo si los datos son correctos', async () => {
    render(
      <BrowserRouter>
        <AuthWrapper><CambiarCorreoPantalla /></AuthWrapper>
      </BrowserRouter>
    );
    
    fireEvent.change(screen.getByLabelText(/Ingrese nuevo correo/i), { target: { value: 'nuevo@correo.com' } });
    fireEvent.change(screen.getByLabelText(/Ingrese nuevamente/i), { target: { value: 'nuevo@correo.com' } });
    fireEvent.click(screen.getByRole('button', { name: /Cambiar Correo/i }));

    await waitFor(() => {
      expect(usuariosService.updateUsuario).toHaveBeenCalledWith(10, { correoElec: 'nuevo@correo.com' }, 'fake-token');
    });
    
    expect(window.alert).toHaveBeenCalledWith('Correo electrónico actualizado exitosamente.');
    expect(mockNavigate).toHaveBeenCalledWith('/configuracion');
  });
});