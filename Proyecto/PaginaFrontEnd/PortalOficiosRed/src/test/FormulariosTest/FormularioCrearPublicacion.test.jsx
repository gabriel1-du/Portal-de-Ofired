import '@testing-library/jest-dom';
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { BrowserRouter } from 'react-router-dom';

// Componente a testear
import FormularioCrearPublicacion from '../../pantallas/Formularios/FormularioCrearPublicacion';

// Contexto
import { AuthContext } from '../../context/AuthContext';

// Servicios a mockear
import * as regionService from '../../servicios/ApiUsuarios/TablasCategorias/regionService';
import * as comunasService from '../../servicios/ApiUsuarios/TablasCategorias/comunasService';
import * as publicacionesService from '../../servicios/ApiPublicaciones/publicacionesService';
import * as fotosPubliService from '../../servicios/ApiPublicaciones/fotosPubli';

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
vi.mock('../../servicios/ApiUsuarios/TablasCategorias/regionService', () => ({
  getAllRegions: vi.fn(),
}));
vi.mock('../../servicios/ApiUsuarios/TablasCategorias/comunasService', () => ({
  getAllComunas: vi.fn(),
}));
vi.mock('../../servicios/ApiPublicaciones/publicacionesService', () => ({
  createPublicacion: vi.fn(),
}));
vi.mock('../../servicios/ApiPublicaciones/fotosPubli', () => ({
  agregarFotoPublicacion: vi.fn(),
}));

// Wrapper para el contexto de autenticación (Simula un usuario logueado)
const AuthWrapper = ({ children }) => {
  const usuarioMock = { idUsuario: 10, username: 'gasfiter@test.com' };
  const tokenMock = "fake-token-jwt-123";
  return (
    <AuthContext.Provider value={{ usuario: usuarioMock, token: tokenMock }}>
      {children}
    </AuthContext.Provider>
  );
};

describe('Test del Componente FormularioCrearPublicacion', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    
    // jsdom no soporta 'URL.createObjectURL' nativamente, así que lo simulamos para que no arroje error
    window.URL.createObjectURL = vi.fn(() => 'blob:http://localhost/fake-url');
    
    // Simulamos las alertas nativas del navegador
    window.alert = vi.fn();

    // Respuestas simuladas de las APIs al montar el componente
    regionService.getAllRegions.mockResolvedValue([{ idRegion: 5, nombreRegion: 'Valparaíso' }]);
    comunasService.getAllComunas.mockResolvedValue([{ idComuna: 20, idRegion: 5, nombreComuna: 'Viña del Mar' }]);
    
    // Simulamos que al crear la publicación, el backend nos devuelve una con ID 100
    publicacionesService.createPublicacion.mockResolvedValue({ idPublicacion: 100 });
  });

  it('Debe permitir llenar el formulario, subir fotos y encadenar las llamadas a la API correctamente', async () => {
    render(
      <BrowserRouter>
        <AuthWrapper>
          <FormularioCrearPublicacion />
        </AuthWrapper>
      </BrowserRouter>
    );

    // 1. Esperamos a que carguen las listas desplegables
    await waitFor(() => {
      expect(screen.getByText('Valparaíso')).toBeInTheDocument();
      expect(screen.getByText('Viña del Mar')).toBeInTheDocument();
    });

    // 2. Llenamos los campos de texto, números y listas desplegables
    fireEvent.change(document.querySelector('input[name="tituloPublicacion"]'), { target: { value: 'Reparación de Cañerías' } });
    fireEvent.change(document.querySelector('textarea[name="descripcionPublicacion"]'), { target: { value: 'Arreglo de cañerías de cobre y PVC.' } });
    fireEvent.change(document.querySelector('select[name="idRegion"]'), { target: { value: '5' } });
    fireEvent.change(document.querySelector('select[name="idComuna"]'), { target: { value: '20' } });
    fireEvent.change(document.querySelector('input[name="precioServicio"]'), { target: { value: '15000' } });

    // 3. Simulamos la subida de una imagen al input file
    const fakeFile = new File(['(⌐□_□)'], 'foto_trabajo.png', { type: 'image/png' });
    const inputUpload = document.querySelector('input[type="file"]');
    fireEvent.change(inputUpload, { target: { files: [fakeFile] } });

    // 4. Hacemos clic en el botón de publicar
    fireEvent.click(screen.getByRole('button', { name: /Publicar Servicio/i }));

    // 5. Verificamos la primera llamada: Creación de los datos base
    await waitFor(() => {
      expect(publicacionesService.createPublicacion).toHaveBeenCalledWith(
        expect.objectContaining({ idAutor: 10, tituloPublicacion: 'Reparación de Cañerías', idRegion: 5, idComuna: 20, precioServicio: 15000 }),
        'fake-token-jwt-123'
      );
    });

    // 6. Verificamos la segunda llamada (encadenada): Subir la foto al ID 100
    expect(fotosPubliService.agregarFotoPublicacion).toHaveBeenCalledWith(100, fakeFile, 'fake-token-jwt-123');
    expect(mockNavigate).toHaveBeenCalledWith('/home');
  });
});