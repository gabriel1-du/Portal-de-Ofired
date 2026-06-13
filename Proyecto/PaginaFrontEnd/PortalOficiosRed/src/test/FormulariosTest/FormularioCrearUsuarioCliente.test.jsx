import React, { useState } from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { BrowserRouter } from 'react-router-dom';

// Componente a testear
import FormularioCrearUsuarioCliente from '../../pantallas/Formularios/FomulariosHome/FormularioCrearUsuarioCliente';

// Contexto
import { FormularioContext } from '../../context/FormularioContext';

// Servicios a mockear (engañar)
import * as regionService from '../../servicios/ApiUsuarios/TablasCategorias/regionService';
import * as comunasService from '../../servicios/ApiUsuarios/TablasCategorias/comunasService';
import * as sexoService from '../../servicios/ApiUsuarios/TablasCategorias/sexoService';

// 1. MOCK DEL ROUTER (useNavigate)
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

// 2. MOCK DE LOS SERVICIOS DE LAS LISTAS
vi.mock('../../servicios/ApiUsuarios/TablasCategorias/regionService', () => ({
  getAllRegions: vi.fn(),
}));
vi.mock('../../servicios/ApiUsuarios/TablasCategorias/comunasService', () => ({
  getAllComunas: vi.fn(),
}));
vi.mock('../../servicios/ApiUsuarios/TablasCategorias/sexoService', () => ({
  getAllSexos: vi.fn(),
}));

// Variable para espiar cuando el componente actualiza el contexto
const mockUpdateFormData = vi.fn();

// Componente Wrapper para simular el FormularioContext
const FormularioWrapper = ({ children }) => {
  const [formData, setFormData] = useState({ idTipoUsu: 1 }); // Estado inicial falso
  
  const updateFormData = (newData) => {
    mockUpdateFormData(newData); // Espiamos qué datos llegan
    setFormData((prev) => ({ ...prev, ...newData })); // Actualizamos el estado real
  };
  
  return (
    <FormularioContext.Provider value={{ formData, updateFormData }}>
      {children}
    </FormularioContext.Provider>
  );
};

describe('Test del Componente FormularioCrearUsuarioCliente', () => {
  beforeEach(() => {
    vi.clearAllMocks();

    // Simulamos que la API nos responde con estos datos
    regionService.getAllRegions.mockResolvedValue([{ idRegion: 1, nombreRegion: 'Región Metropolitana' }]);
    comunasService.getAllComunas.mockResolvedValue([{ idComuna: 1, idRegion: 1, nombreComuna: 'Santiago' }]);
    sexoService.getAllSexos.mockResolvedValue([{ idSexo: 1, nombreSexo: 'Masculino' }]);
  });

  it('Debe permitir ingresar todos los datos, actualizar el contexto y navegar exitosamente', async () => {
    render(
      <BrowserRouter>
        <FormularioWrapper>
          <FormularioCrearUsuarioCliente />
        </FormularioWrapper>
      </BrowserRouter>
    );

    // Esperamos que se resuelvan las Promesas simuladas y carguen los selects
    await waitFor(() => {
      expect(screen.getByText('Región Metropolitana')).toBeInTheDocument();
      expect(screen.getByText('Masculino')).toBeInTheDocument();
    });

    // 1. Simular la escritura en los campos de texto
    fireEvent.change(screen.getByLabelText(/Primer Nombre:/i), { target: { name: 'primerNombre', value: 'Juan' } });
    fireEvent.change(screen.getByLabelText(/Primer Apellido:/i), { target: { name: 'primerApellido', value: 'Perez' } });
    fireEvent.change(screen.getByLabelText(/Correo Electrónico:/i), { target: { name: 'correoElec', value: 'juan@test.com' } });
    fireEvent.change(screen.getByLabelText(/Contraseña:/i), { target: { name: 'password', value: 'secreta123' } });
    fireEvent.change(screen.getByLabelText(/Número de Teléfono:/i), { target: { name: 'numeroTelef', value: '+56912345678' } });

    // 2. Simular selección de listas
    fireEvent.change(screen.getByLabelText(/Sexo:/i), { target: { name: 'idSexoUsu', value: '1' } });
    
    // Comuna debe estar deshabilitada hasta elegir la región
    const selectComuna = screen.getByLabelText(/Comuna:/i);
    expect(selectComuna).toBeDisabled();

    // Elegimos región y esperamos que se habilite la comuna
    fireEvent.change(screen.getByLabelText(/Región:/i), { target: { name: 'idRegionUsu', value: '1' } });
    
    await waitFor(() => {
      expect(selectComuna).not.toBeDisabled();
    });
    
    fireEvent.change(selectComuna, { target: { name: 'idComunaUsu', value: '1' } });

    // 3. Hacemos clic en enviar
    fireEvent.click(screen.getByRole('button', { name: /Siguiente Paso/i }));

    // 4. Verificamos que el sistema validó el correo correcto y procedió a navegar
    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/crear-perfil');
    });

    // 5. Verificamos que los datos capturados hayan sido inyectados al Contexto
    expect(mockUpdateFormData).toHaveBeenCalledWith(expect.objectContaining({ primerNombre: 'Juan' }));
    expect(mockUpdateFormData).toHaveBeenCalledWith(expect.objectContaining({ correoElec: 'juan@test.com' }));
  });
});