import '@testing-library/jest-dom';
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { BrowserRouter } from 'react-router-dom';

// Componente a testear
import RecuperarPassword from '../../pantallas/Formularios/FomulariosHome/RecuperarPassword';

// Servicios y Librerías a mockear
import * as usuariosService from '../../servicios/usuariosService';
import * as jwtDecodeModule from 'jwt-decode';

// 1. MOCK DEL ROUTER (useNavigate y useSearchParams)
const mockNavigate = vi.fn();
const mockSearchParams = new URLSearchParams();

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
    useSearchParams: () => [mockSearchParams, vi.fn()],
  };
});

// 2. MOCK DE LOS SERVICIOS
vi.mock('../../servicios/usuariosService', () => ({
  getUsuarioById: vi.fn(),
  updateUsuario: vi.fn(),
}));

// 3. MOCK DE JWT-DECODE
vi.mock('jwt-decode', () => ({
  jwtDecode: vi.fn(),
}));

describe('Test del Componente RecuperarPassword', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    
    // Simulamos las alertas nativas del navegador
    window.alert = vi.fn();
    
    // Configuramos un token válido por defecto
    mockSearchParams.set('token', 'fake-token-jwt-123');
    
    // Configuramos el mock de jwtDecode
    jwtDecodeModule.jwtDecode.mockReturnValue({
      userId: 5,
      username: 'usuario@test.com',
      rol: 'user'
    });
    
    // Configuramos el mock de getUsuarioById
    usuariosService.getUsuarioById.mockResolvedValue({
      idUsuario: 5,
      username: 'usuario@test.com',
      email: 'usuario@test.com',
      nombre: 'Usuario Test'
    });
  });

  it('Debe mostrar error si no hay token en la URL', async () => {
    // Eliminamos el token
    mockSearchParams.delete('token');

    render(
      <BrowserRouter>
        <RecuperarPassword />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText(/Token de recuperación no válido o expirado/i)).toBeInTheDocument();
    });

    // Verificamos que haya un botón para volver a iniciar sesión
    expect(screen.getByRole('button', { name: /Volver a Iniciar Sesión/i })).toBeInTheDocument();
  });

  it('Debe mostrar error si las contraseñas no coinciden', async () => {
    render(
      <BrowserRouter>
        <RecuperarPassword />
      </BrowserRouter>
    );

    // Esperamos a que el componente cargue y obtenga el usuario
    await waitFor(() => {
      expect(usuariosService.getUsuarioById).toHaveBeenCalledWith(5);
    });

    // Llenamos las contraseñas (no coinciden)
    fireEvent.change(screen.getByLabelText(/Nueva Contraseña:/i), { target: { value: 'password123' } });
    fireEvent.change(screen.getByLabelText(/Confirmar Contraseña:/i), { target: { value: 'password456' } });

    // Hacemos clic en el botón de cambiar
    fireEvent.click(screen.getByRole('button', { name: /Cambiar Contraseña/i }));

    // Verificamos que se mostró el mensaje de error
    await waitFor(() => {
      expect(screen.getByText(/Las contraseñas no coinciden/i)).toBeInTheDocument();
    });

    // Verificamos que NO se llamó a updateUsuario
    expect(usuariosService.updateUsuario).not.toHaveBeenCalled();
  });

  it('Debe cambiar la contraseña exitosamente, mostrar alert y redirigir', async () => {
    // Configuramos updateUsuario para que resuelva exitosamente
    usuariosService.updateUsuario.mockResolvedValue({ success: true });

    render(
      <BrowserRouter>
        <RecuperarPassword />
      </BrowserRouter>
    );

    // Esperamos a que el componente cargue y obtenga el usuario
    await waitFor(() => {
      expect(usuariosService.getUsuarioById).toHaveBeenCalledWith(5);
    });

    // Llenamos las contraseñas (coinciden)
    fireEvent.change(screen.getByLabelText(/Nueva Contraseña:/i), { target: { value: 'nuevapassword123' } });
    fireEvent.change(screen.getByLabelText(/Confirmar Contraseña:/i), { target: { value: 'nuevapassword123' } });

    // Hacemos clic en el botón de cambiar
    fireEvent.click(screen.getByRole('button', { name: /Cambiar Contraseña/i }));

    // Verificamos que se llamó a updateUsuario con los datos correctos
    await waitFor(() => {
      expect(usuariosService.updateUsuario).toHaveBeenCalledWith(
        5,
        expect.objectContaining({ password: 'nuevapassword123' }),
        'fake-token-jwt-123'
      );
    });

    // Verificamos que se mostró el alert
    await waitFor(() => {
      expect(window.alert).toHaveBeenCalledWith('Contraseña exitosamente creada');
    });

    // Verificamos que se redirigió a iniciar sesión
    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/iniciar-sesion');
    });
  });

  it('Debe mostrar mensaje de error si la actualización falla', async () => {
    // Configuramos updateUsuario para que falle
    usuariosService.updateUsuario.mockRejectedValue(new Error('Error de prueba'));

    render(
      <BrowserRouter>
        <RecuperarPassword />
      </BrowserRouter>
    );

    // Esperamos a que el componente cargue y obtenga el usuario
    await waitFor(() => {
      expect(usuariosService.getUsuarioById).toHaveBeenCalledWith(5);
    });

    // Llenamos las contraseñas
    fireEvent.change(screen.getByLabelText(/Nueva Contraseña:/i), { target: { value: 'nuevapassword123' } });
    fireEvent.change(screen.getByLabelText(/Confirmar Contraseña:/i), { target: { value: 'nuevapassword123' } });

    // Hacemos clic en el botón de cambiar
    fireEvent.click(screen.getByRole('button', { name: /Cambiar Contraseña/i }));

    // Verificamos que se llamó a updateUsuario
    await waitFor(() => {
      expect(usuariosService.updateUsuario).toHaveBeenCalled();
    });

    // Verificamos que se mostró el mensaje real del error
    await waitFor(() => {
      expect(screen.getByText('Error de prueba')).toBeInTheDocument();
    });

    // Verificamos que NO se mostró el alert ni se redirigió
    expect(window.alert).not.toHaveBeenCalled();
    expect(mockNavigate).not.toHaveBeenCalled();
  });
});