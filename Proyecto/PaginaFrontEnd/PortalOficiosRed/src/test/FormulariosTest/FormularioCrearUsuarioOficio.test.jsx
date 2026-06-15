import '@testing-library/jest-dom';
import React, { useState } from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { BrowserRouter } from 'react-router-dom';

// Componente a testear
import FormularioCrearUsuarioOficio from '../../pantallas/Formularios/FomulariosHome/FormularioCrearUsuarioOficio';

// Contexto
import { FormularioContext } from '../../context/FormularioContext';

// Servicios y Utilidades a mockear (engañar)
import * as regionService from '../../servicios/ApiUsuarios/TablasCategorias/regionService';
import * as comunasService from '../../servicios/ApiUsuarios/TablasCategorias/comunasService';
import * as sexoService from '../../servicios/ApiUsuarios/TablasCategorias/sexoService';
import * as oficioService from '../../servicios/ApiUsuarios/TablasCategorias/oficioService';
import * as verificacionRut from '../../utils/verificaciones/verificacionRut';

// 1. MOCK DEL ROUTER (useNavigate)
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

// 2. MOCK DE LOS SERVICIOS Y UTILIDADES
vi.mock('../../servicios/ApiUsuarios/TablasCategorias/regionService', () => ({
  getAllRegions: vi.fn(),
}));
vi.mock('../../servicios/ApiUsuarios/TablasCategorias/comunasService', () => ({
  getAllComunas: vi.fn(),
}));
vi.mock('../../servicios/ApiUsuarios/TablasCategorias/sexoService', () => ({
  getAllSexos: vi.fn(),
}));
vi.mock('../../servicios/ApiUsuarios/TablasCategorias/oficioService', () => ({
  getAllOficios: vi.fn(),
}));
vi.mock('../../utils/verificaciones/verificacionRut', () => ({
  validarRut: vi.fn(),
}));

// Variable para espiar cuando el componente actualiza el contexto
const mockUpdateFormData = vi.fn();

// Componente Wrapper para simular el FormularioContext
const FormularioWrapper = ({ children }) => {
  // Declaramos los campos vacíos desde el principio para evitar la advertencia de React (Uncontrolled input)
  const [formData, setFormData] = useState({ 
    idTipoUsu: 2,
    primerNombre: '',
    segundoNombre: '',
    primerApellido: '',
    segundoApellido: '',
    rut: '',
    correoElec: '',
    password: '',
    numeroTelef: '',
    idSexoUsu: '',
    idOficio: '',
    idRegionUsu: '',
    idComunaUsu: ''
  });
  
  const updateFormData = (newData) => {
    mockUpdateFormData(newData);
    setFormData((prev) => ({ ...prev, ...newData }));
  };
  
  return (
    <FormularioContext.Provider value={{ formData, updateFormData }}>
      {children}
    </FormularioContext.Provider>
  );
};

describe('Test del Componente FormularioCrearUsuarioOficio', () => {
  beforeEach(() => {
    vi.clearAllMocks();

    // Simulamos que las APIs nos responden con estos datos
    regionService.getAllRegions.mockResolvedValue([{ idRegion: 1, nombreRegion: 'Región Metropolitana' }]);
    comunasService.getAllComunas.mockResolvedValue([{ idComuna: 1, idRegion: 1, nombreComuna: 'Santiago' }]);
    sexoService.getAllSexos.mockResolvedValue([{ idSexo: 1, nombreSexo: 'Femenino' }]);
    oficioService.getAllOficios.mockResolvedValue([{ idOficio: 1, nombreOficio: 'Electricista' }]);
    
    // Por defecto hacemos que la validación del RUT pase correctamente
    verificacionRut.validarRut.mockReturnValue(true);
  });

  it('Debe permitir ingresar datos, validar el RUT correctamente y navegar', async () => {
    render(
      <BrowserRouter>
        <FormularioWrapper>
          <FormularioCrearUsuarioOficio />
        </FormularioWrapper>
      </BrowserRouter>
    );

    // Esperamos que carguen todas las listas
    await waitFor(() => {
      expect(screen.getByText('Región Metropolitana')).toBeInTheDocument();
      expect(screen.getByText('Femenino')).toBeInTheDocument();
      expect(screen.getByText('Electricista')).toBeInTheDocument();
    });

    // 1. Llenamos campos de texto (incluyendo el RUT)
    fireEvent.change(screen.getByLabelText(/Primer Nombre:/i), { target: { name: 'primerNombre', value: 'María' } });
    fireEvent.change(screen.getByLabelText(/Primer Apellido:/i), { target: { name: 'primerApellido', value: 'Pérez' } });
    fireEvent.change(screen.getByLabelText(/RUT:/i), { target: { name: 'rut', value: '12345678-9' } });
    fireEvent.change(screen.getByLabelText(/Correo Electrónico:/i), { target: { name: 'correoElec', value: 'maria@oficio.com' } });
    fireEvent.change(screen.getByLabelText(/Contraseña:/i), { target: { name: 'password', value: 'segura123' } });
    fireEvent.change(screen.getByLabelText(/Número de Teléfono:/i), { target: { name: 'numeroTelef', value: '+56911223344' } });

    // 2. Elegimos las opciones de los selects
    fireEvent.change(screen.getByLabelText(/Sexo:/i), { target: { name: 'idSexoUsu', value: '1' } });
    fireEvent.change(screen.getByLabelText(/Oficio:/i), { target: { name: 'idOficio', value: '1' } });
    
    const selectComuna = screen.getByLabelText(/Comuna:/i);
    expect(selectComuna).toBeDisabled();
    
    fireEvent.change(screen.getByLabelText(/Región:/i), { target: { name: 'idRegionUsu', value: '1' } });
    await waitFor(() => {
      expect(selectComuna).not.toBeDisabled();
    });
    fireEvent.change(selectComuna, { target: { name: 'idComunaUsu', value: '1' } });

    // 3. Enviamos el formulario
    fireEvent.click(screen.getByRole('button', { name: /Siguiente Paso/i }));

    // 4. Verificaciones
    await waitFor(() => {
      // Verificamos que sí se mandó a llamar a la función utilitaria externa del RUT
      expect(verificacionRut.validarRut).toHaveBeenCalledWith('12345678-9');
      // Y comprobamos que navegó exitosamente
      expect(mockNavigate).toHaveBeenCalledWith('/crear-perfil');
    });
  });
});