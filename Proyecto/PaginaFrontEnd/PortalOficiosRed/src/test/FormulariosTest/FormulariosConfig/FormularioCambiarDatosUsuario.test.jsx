import '@testing-library/jest-dom';
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { BrowserRouter } from 'react-router-dom';

// Componente a testear
import FormularioCambiarDatosUsuario from '../../../pantallas/FormulariosConfig/FormularioCambiarDatosUsuario';

// Contexto
import { AuthContext } from '../../../context/AuthContext';

// Servicios y Utils a mockear
import * as usuariosService from '../../../servicios/usuariosService';
import * as regionService from '../../../servicios/ApiUsuarios/TablasCategorias/regionService';
import * as comunasService from '../../../servicios/ApiUsuarios/TablasCategorias/comunasService';
import * as sexoService from '../../../servicios/ApiUsuarios/TablasCategorias/sexoService';
import * as oficioService from '../../../servicios/ApiUsuarios/TablasCategorias/oficioService';
import * as verificacionRut from '../../../utils/verificaciones/verificacionRut';

const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return { ...actual, useNavigate: () => mockNavigate };
});

vi.mock('../../../servicios/usuariosService', () => ({
  getUsuarioById: vi.fn(),
  updateUsuario: vi.fn(),
}));
vi.mock('../../../servicios/ApiUsuarios/TablasCategorias/regionService', () => ({ getAllRegions: vi.fn() }));
vi.mock('../../../servicios/ApiUsuarios/TablasCategorias/comunasService', () => ({ getAllComunas: vi.fn() }));
vi.mock('../../../servicios/ApiUsuarios/TablasCategorias/sexoService', () => ({ getAllSexos: vi.fn() }));
vi.mock('../../../servicios/ApiUsuarios/TablasCategorias/oficioService', () => ({ getAllOficios: vi.fn() }));
vi.mock('../../../utils/verificaciones/verificacionRut', () => ({ validarRut: vi.fn() }));

const AuthWrapper = ({ children }) => (
  <AuthContext.Provider value={{ usuario: { idUsuario: 20, username: 'config@test.com' }, token: 'fake-token' }}>
    {children}
  </AuthContext.Provider>
);

describe('Test del Componente FormularioCambiarDatosUsuario', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    window.alert = vi.fn();

    // Simulamos carga de listas
    regionService.getAllRegions.mockResolvedValue([{ idRegion: 1, nombreRegion: 'Región Metropolitana' }]);
    comunasService.getAllComunas.mockResolvedValue([{ idComuna: 1, idRegion: 1, nombreComuna: 'Santiago' }]);
    sexoService.getAllSexos.mockResolvedValue([{ idSexo: 1, nombreSexo: 'Femenino' }]);
    oficioService.getAllOficios.mockResolvedValue([{ idOficio: 2, nombreOficio: 'Carpintero' }]);

    // Simulamos usuario recuperado desde BD (tipo oficio para que muestre el RUT)
    usuariosService.getUsuarioById.mockResolvedValue({
      primerNombre: 'Ana',
      primerApellido: 'López',
      idSexoUsu: 1,
      rut: '12345678',
      rutDv: '9',
      idRegionUsu: 1,
      idComunaUsu: 1,
      idOficio: 2,
      idTipoUsu: 2 // Indica que es usuario oficio
    });

    usuariosService.updateUsuario.mockResolvedValue({});
    verificacionRut.validarRut.mockReturnValue(true); // Simulamos rut válido
  });

  it('Debe cargar datos iniciales, permitir modificarlos y enviar', async () => {
    render(
      <BrowserRouter>
        <AuthWrapper><FormularioCambiarDatosUsuario /></AuthWrapper>
      </BrowserRouter>
    );

    // 1. Verificamos que se hayan cargado los datos iniciales
    await waitFor(() => {
      expect(screen.getByDisplayValue('Ana')).toBeInTheDocument();
      expect(screen.getByDisplayValue('12345678-9')).toBeInTheDocument(); // RUT formateado
    });

    // 2. Modificamos algunos valores
    fireEvent.change(screen.getByLabelText(/Primer Nombre:/i), { target: { name: 'primerNombre', value: 'Anita' } });
    fireEvent.change(screen.getByLabelText(/RUT:/i), { target: { name: 'rut', value: '9876543-2' } });

    // 3. Enviamos el formulario
    fireEvent.click(screen.getByRole('button', { name: /Guardar Cambios/i }));

    // 4. Verificamos que se limpió/estructuró el RUT y se envió a la API
    await waitFor(() => {
      expect(usuariosService.updateUsuario).toHaveBeenCalledWith(20, expect.objectContaining({
        primerNombre: 'Anita',
        rut: '9876543', // rut limpio (separado)
        rutDv: '2',     // dígito verificador
        idTipoUsu: 2
      }), 'fake-token');
    });

    expect(window.alert).toHaveBeenCalledWith('Datos actualizados correctamente.');
    expect(mockNavigate).toHaveBeenCalledWith('/configuracion');
  });
});