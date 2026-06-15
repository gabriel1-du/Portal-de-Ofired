import '@testing-library/jest-dom';
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { BrowserRouter } from 'react-router-dom';

// Componente a testear
import IniciarSesion from '../../pantallas/Formularios/FomulariosHome/IniciarSesion';

// Contexto
import { AuthContext } from '../../context/AuthContext';

// Servicios y Librerías a mockear
import * as authService from '../../servicios/ApiGateWay/authService';
import * as jwtDecodeModule from 'jwt-decode';

// 1. MOCK DEL ROUTER (useNavigate)
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

// 2. MOCK DEL SERVICIO DE LOGIN
vi.mock('../../servicios/ApiGateWay/authService', () => ({
  login: vi.fn(),
}));

// 3. MOCK DE JWT-DECODE
vi.mock('jwt-decode', () => ({
  jwtDecode: vi.fn(),
}));

// Espía para la función del contexto
const mockIniciarSesion = vi.fn();

// Componente Wrapper para simular el AuthContext
const AuthWrapper = ({ children, token = null, usuario = null }) => (
  <AuthContext.Provider value={{ iniciarSesion: mockIniciarSesion, token, usuario }}>
    {children}
  </AuthContext.Provider>
);

describe('Test del Componente IniciarSesion', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('Debe iniciar sesión exitosamente, decodificar el token y redirigir al home', async () => {
    // Configuramos las respuestas simuladas
    const fakeToken = "eyJhbGciOiJIUzI1NiIsInR...fake_token_falso";
    authService.login.mockResolvedValue({ token: fakeToken });
    
    jwtDecodeModule.jwtDecode.mockReturnValue({
      userId: 99,
      username: 'usuario@test.com',
      rol: 'ADMIN'
    });

    render(
      <BrowserRouter>
        <AuthWrapper>
          <IniciarSesion />
        </AuthWrapper>
      </BrowserRouter>
    );

    // 1. Llenamos el formulario
    fireEvent.change(screen.getByLabelText(/Correo Electrónico:/i), { target: { value: 'usuario@test.com' } });
    fireEvent.change(screen.getByLabelText(/Contraseña:/i), { target: { value: 'password123' } });

    // 2. Enviamos el formulario
    fireEvent.click(screen.getByRole('button', { name: /Ingresar a mi cuenta/i }));

    // 3. Verificamos que se llamó a la API con las credenciales correctas
    await waitFor(() => {
      expect(authService.login).toHaveBeenCalledWith({ email: 'usuario@test.com', password: 'password123' });
    });

    // 4. Esperamos a que la promesa se resuelva y aparezca el mensaje de éxito
    await waitFor(() => {
      expect(screen.getByText('Inicio de sesión exitoso. Redirigiendo...')).toBeInTheDocument();
    });

    // 5. Verificamos que se decodificó el token y se inyectó al contexto global
    expect(jwtDecodeModule.jwtDecode).toHaveBeenCalledWith(fakeToken);
    expect(mockIniciarSesion).toHaveBeenCalledWith(fakeToken, expect.objectContaining({
      idUsuario: 99,
      username: 'usuario@test.com',
      habilitadorAdministrador: true // Comprobamos que leyó el 'ADMIN'
    }));

    // 6. Verificamos que navegó al Home tras el setTimeout (le damos hasta 3 segundos)
    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/home');
    }, { timeout: 3000 });
  });
});