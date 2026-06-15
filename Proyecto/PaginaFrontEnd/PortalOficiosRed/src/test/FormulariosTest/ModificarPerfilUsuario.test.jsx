import '@testing-library/jest-dom';
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { BrowserRouter } from 'react-router-dom';

// Componente a testear
import ModificarPerfilUsuario from '../../pantallas/Formularios/ModificarPerfilUsuario';

// Contexto
import { AuthContext } from '../../context/AuthContext';

// Servicios a mockear
import * as perfilesService from '../../servicios/ApiUsuarios/perfilesUsuarioService';
import * as usuariosService from '../../servicios/usuariosService';

// 1. MOCK DEL ROUTER (useNavigate)
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

// 2. MOCK DE LOS SERVICIOS
vi.mock('../../servicios/ApiUsuarios/perfilesUsuarioService', () => ({
  getPerfilFrontByUsuarioId: vi.fn(),
  updatePerfilUsuario: vi.fn(),
}));
vi.mock('../../servicios/usuariosService', () => ({
  updateUsuario: vi.fn(),
}));

// Wrapper para el contexto de autenticación
const AuthWrapper = ({ children }) => (
  <AuthContext.Provider value={{ usuario: { idUsuario: 42, username: 'maestro@test.com' }, token: 'fake-token-123' }}>
    {children}
  </AuthContext.Provider>
);

describe('Test del Componente ModificarPerfilUsuario', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Simulamos las alertas nativas y la URL de las fotos previsualizadas
    window.alert = vi.fn();
    window.URL.createObjectURL = vi.fn(() => 'blob:http://localhost/fake-url');

    // Simulamos que al abrir la pantalla, el backend devuelve el perfil actual del usuario
    perfilesService.getPerfilFrontByUsuarioId.mockResolvedValue({
      idPerfilUsuario: 100, // ID interno del perfil
      nombreApodo: 'Maestro Gasfiter',
      descripcion: 'Experto en cañerías viejas',
      fotografiaBanner: 'url_banner_antiguo.png',
      foto: 'url_foto_antigua.png'
    });

    // Simulamos respuestas exitosas al guardar
    perfilesService.updatePerfilUsuario.mockResolvedValue({});
    usuariosService.updateUsuario.mockResolvedValue({});
  });

  it('Debe cargar el perfil actual, permitir modificarlo y disparar las actualizaciones a la API', async () => {
    render(
      <BrowserRouter>
        <AuthWrapper>
          <ModificarPerfilUsuario />
        </AuthWrapper>
      </BrowserRouter>
    );

    // 1. Verificamos que el sistema trajo los datos de la BD y los inyectó en los inputs
    await waitFor(() => {
      expect(screen.getByDisplayValue('Maestro Gasfiter')).toBeInTheDocument();
      expect(screen.getByDisplayValue('Experto en cañerías viejas')).toBeInTheDocument();
    });

    // 2. Modificamos los campos de texto
    fireEvent.change(screen.getByLabelText(/Apodo:/i), { target: { name: 'nombreApodo', value: 'Súper Maestro Gasfiter' } });
    fireEvent.change(screen.getByLabelText(/Descripción:/i), { target: { name: 'descripcion', value: 'Experto en cañerías y calefacción' } });

    // 3. Modificamos los inputs de archivo (Fotos)
    const fakeFoto = new File(['(⌐□_□)'], 'nueva_foto.png', { type: 'image/png' });
    const fakeBanner = new File(['(⌐□_□)'], 'nuevo_banner.png', { type: 'image/png' });
    fireEvent.change(document.querySelector('input[name="foto"]'), { target: { name: 'foto', files: [fakeFoto] } });
    fireEvent.change(document.querySelector('input[name="fotografiaBanner"]'), { target: { name: 'fotografiaBanner', files: [fakeBanner] } });

    // 4. Hacemos clic en el botón de guardar
    fireEvent.click(screen.getByRole('button', { name: /Guardar cambios/i }));

    // 5. Verificamos que las peticiones se dividan correctamente hacia sus respectivos microservicios
    await waitFor(() => {
      // Petición a usuariosService (para la foto principal)
      expect(usuariosService.updateUsuario).toHaveBeenCalledWith(42, { foto: fakeFoto }, 'fake-token-123');
      // Petición a perfilesUsuarioService (para el banner, apodo y descripción)
      expect(perfilesService.updatePerfilUsuario).toHaveBeenCalledWith(100, { nombreApodo: 'Súper Maestro Gasfiter', descripcion: 'Experto en cañerías y calefacción', fotografiaBanner: fakeBanner }, 'fake-token-123');
    });

    // 6. Verificamos alert de éxito y navegación
    expect(window.alert).toHaveBeenCalledWith('Perfil actualizado con éxito.');
    expect(mockNavigate).toHaveBeenCalledWith('/perfil/42');
  });
});