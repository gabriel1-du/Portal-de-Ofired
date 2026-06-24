import '@testing-library/jest-dom';
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { BrowserRouter } from 'react-router-dom';

// Componente a testear
import PantallaAdministradorMediosDePago from '../../pantallas/SeccionAdministrador/PantallaAdministradorMediosDePago'; // Ajusta si tu ruta de carpetas cambia

// Contexto de autenticación
import { AuthContext } from '../../context/AuthContext';

// Servicio a mockear
import * as medioPagoService from '../../servicios/ApiUsuarios/TablasCategorias/medioDePagoService';

// 1. MOCK DEL ROUTER (useNavigate)
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return { ...actual, useNavigate: () => mockNavigate };
});

// 2. MOCKS DE LOS SERVICIOS DE LA API
vi.mock('../../servicios/ApiUsuarios/TablasCategorias/medioDePagoService', () => ({
  leerTodosLosMediosDePago: vi.fn(),
  eliminarMedioDePago: vi.fn(),
}));

// 3. MOCKS DE SUBCOMPONENTES (Rutas absolutas relativas a este archivo .test para evitar errores de carga)
vi.mock('../../assets/barrasLaterales/BarraLateralAdmin', () => ({
  default: () => <div data-testid="mock-barra-lateral-admin" />
}));

vi.mock('../../pantallas/SeccionAdministrador/FormulariosAdmisnitrador/Fromulario/FormulariosMedioDePago/FormularioEditarMedioDePagoAdmin', () => ({
  default: ({ medioPagoEdicionId, onClose }) => (
    <div data-testid="mock-modal-editar">
      <span>Editando Medio de Pago ID: {medioPagoEdicionId}</span>
      <button onClick={onClose}>Cerrar Editar</button>
    </div>
  )
}));

vi.mock('../../pantallas/SeccionAdministrador/FormulariosAdmisnitrador/Fromulario/FormulariosMedioDePago/FormularioCrearMedioDePagoAdmin', () => ({
  default: ({ onClose }) => (
    <div data-testid="mock-modal-crear">
      <span>Formulario de Creación de Medio de Pago</span>
      <button onClick={onClose}>Cerrar Crear</button>
    </div>
  )
}));

// Mock Data de medios de pago para las respuestas simuladas de la base de datos
const mockMediosPago = [
  { idMedioPago: 1, nombreMedioPago: 'Tarjeta de Crédito' },
  { idMedioPago: 2, nombreMedioPago: 'Transferencia Bancaria' }
];

// Envolvedor para simular sesión activa de Administrador
const AdminAuthWrapper = ({ children, isAdmin = true }) => (
  <AuthContext.Provider value={{ 
    usuario: { idUsuario: 1, habilitadorAdministrador: isAdmin, pNombre: 'Admin' }, 
    token: 'token-seguro-medios-pago-123' 
  }}>
    {children}
  </AuthContext.Provider>
);

describe('Test de Integración - Pantalla Administrador de Medios de Pago', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Simulamos las funciones de confirmación y alertas del navegador
    window.confirm = vi.fn();
    window.alert = vi.fn();
    
    // Por defecto, simulamos que la API devuelve los registros exitosamente
    medioPagoService.leerTodosLosMediosDePago.mockResolvedValue(mockMediosPago);
  });

  it('Debe redirigir a /home si el usuario no tiene rol de Administrador', async () => {
    render(
      <BrowserRouter>
        <AdminAuthWrapper isAdmin={false}>
          <PantallaAdministradorMediosDePago />
        </AdminAuthWrapper>
      </BrowserRouter>
    );

    // Verifica la cláusula de salvaguarda del useEffect
    expect(mockNavigate).toHaveBeenCalledWith('/home');
  });

  it('Debe renderizar la tabla con todos los datos de los medios de pago correctamente', async () => {
    render(
      <BrowserRouter>
        <AdminAuthWrapper isAdmin={true}>
          <PantallaAdministradorMediosDePago />
        </AdminAuthWrapper>
      </BrowserRouter>
    );

    // Esperamos que el useEffect resuelva la carga inicial
    await waitFor(() => expect(medioPagoService.leerTodosLosMediosDePago).toHaveBeenCalled());

    // Corroboramos títulos de columnas y textos dinámicos cargados
    expect(screen.getByText('Tabla de Medios de Pago')).toBeInTheDocument();
    expect(screen.getByText('Tarjeta de Crédito')).toBeInTheDocument();
    expect(screen.getByText('Transferencia Bancaria')).toBeInTheDocument();
  });

  it('Debe filtrar los registros de la tabla basándose en el término de búsqueda', async () => {
    render(
      <BrowserRouter>
        <AdminAuthWrapper isAdmin={true}>
          <PantallaAdministradorMediosDePago />
        </AdminAuthWrapper>
      </BrowserRouter>
    );

    await waitFor(() => expect(medioPagoService.leerTodosLosMediosDePago).toHaveBeenCalled());

    // Buscamos la barra de texto por su placeholder
    const inputBusqueda = screen.getByPlaceholderText(/Buscar por nombre.../i);
    
    // Simulamos que el usuario escribe "Tarjeta"
    fireEvent.change(inputBusqueda, { target: { value: 'Tarjeta' } });

    // Tarjeta de Crédito debe seguir existiendo en el DOM, Transferencia Bancaria debe ocultarse
    expect(screen.getByText('Tarjeta de Crédito')).toBeInTheDocument();
    expect(screen.queryByText('Transferencia Bancaria')).not.toBeInTheDocument();
  });

  it('Debe abrir el modal de creación al hacer clic en el botón "+ Crear Medio de Pago"', async () => {
    render(
      <BrowserRouter>
        <AdminAuthWrapper isAdmin={true}>
          <PantallaAdministradorMediosDePago />
        </AdminAuthWrapper>
      </BrowserRouter>
    );

    await waitFor(() => expect(medioPagoService.leerTodosLosMediosDePago).toHaveBeenCalled());

    const botonCrear = screen.getByRole('button', { name: /\+ Crear Medio de Pago/i });
    fireEvent.click(botonCrear);

    // Verificamos que el componente condicional simulado ahora está montado
    expect(screen.getByTestId('mock-modal-crear')).toBeInTheDocument();
  });

  it('Debe abrir el modal de edición pasándole el ID correcto al seleccionar "Editar"', async () => {
    render(
      <BrowserRouter>
        <AdminAuthWrapper isAdmin={true}>
          <PantallaAdministradorMediosDePago />
        </AdminAuthWrapper>
      </BrowserRouter>
    );

    await waitFor(() => expect(medioPagoService.leerTodosLosMediosDePago).toHaveBeenCalled());

    // Obtenemos todos los selectores de acciones (habrá uno por cada fila)
    const selectoresAcciones = screen.getAllByRole('combobox');
    
    // Seleccionamos "editar" en el menú del segundo registro (Transferencia Bancaria, ID: 2)
    fireEvent.change(selectoresAcciones[1], { target: { value: 'editar' } });

    // Verificamos que se abre el modal reflejando el ID enviado por parámetro
    expect(screen.getByTestId('mock-modal-editar')).toBeInTheDocument();
    expect(screen.getByText('Editando Medio de Pago ID: 2')).toBeInTheDocument();
  });

  it('Debe ejecutar el ciclo de eliminación completo con éxito (Confirmar -> Llamar API -> Alerta de éxito -> Recargar)', async () => {
    // Configuramos los mocks específicos para este flujo destructivo
    window.confirm.mockReturnValue(true); // El usuario hace clic en "Aceptar"
    medioPagoService.eliminarMedioDePago.mockResolvedValue(true); // La API responde con éxito

    render(
      <BrowserRouter>
        <AdminAuthWrapper isAdmin={true}>
          <PantallaAdministradorMediosDePago />
        </AdminAuthWrapper>
      </BrowserRouter>
    );

    await waitFor(() => expect(medioPagoService.leerTodosLosMediosDePago).toHaveBeenCalled());

    const selectoresAcciones = screen.getAllByRole('combobox');
    
    // Disparamos la acción de eliminar en la primera fila (Tarjeta de Crédito, ID: 1)
    fireEvent.change(selectoresAcciones[0], { target: { value: 'eliminar' } });

    // 1. Comprobar que saltó el cuadro de confirmación con el texto correspondiente
    expect(window.confirm).toHaveBeenCalledWith('¿Estás seguro de que deseas eliminar este medio de pago?');
    
    // 2. Comprobar que llamó al servicio borrando el ID 1 junto con el token JWT de administración
    expect(medioPagoService.eliminarMedioDePago).toHaveBeenCalledWith(1, 'token-seguro-medios-pago-123');

    // 3. Comprobar el alert de éxito escrito en tu componente
    await waitFor(() => {
      expect(window.alert).toHaveBeenCalledWith('Medio de pago eliminado correctamente.');
    });

    // Comprobar que la grilla volvió a ejecutarse para refrescar (1 inicial + 1 post borrado)
    expect(medioPagoService.leerTodosLosMediosDePago).toHaveBeenCalledTimes(2);
  });
});