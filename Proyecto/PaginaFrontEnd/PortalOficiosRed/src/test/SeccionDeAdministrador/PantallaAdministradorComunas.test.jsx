import '@testing-library/jest-dom';
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { BrowserRouter } from 'react-router-dom';

// Componente a testear
import PantallaAdministradorComunas from '../../pantallas/SeccionAdministrador/PantallaAdministradorComunas'; 

// Contexto de autenticación
import { AuthContext } from '../../context/AuthContext';

// Servicio a mockear
import * as comunasService from '../../servicios/ApiUsuarios/TablasCategorias/comunasService';

// 1. MOCK DEL ROUTER (useNavigate)
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return { ...actual, useNavigate: () => mockNavigate };
});

// 2. MOCKS DE LOS SERVICIOS DE LA API
vi.mock('../../servicios/ApiUsuarios/TablasCategorias/comunasService', () => ({
  getAllComunas: vi.fn(),
  deleteComuna: vi.fn(),
}));

// 3. MOCKS DE SUBCOMPONENTES (Aislamos la lógica compleja de los modales y barras)
// 3. MOCKS DE SUBCOMPONENTES (Rutas corregidas relativas al archivo .test.jsx)
vi.mock('../../assets/barrasLaterales/BarraLateralAdmin', () => ({
  default: () => <div data-testid="mock-barra-lateral-admin" />
}));

vi.mock('../../pantallas/SeccionAdministrador/FormulariosAdmisnitrador/Fromulario/FomrularioComuna/FormularioEditarComunaAdmin', () => ({
  default: ({ comunaEdicionId, onClose }) => (
    <div data-testid="mock-modal-editar">
      <span>Editando Comuna ID: {comunaEdicionId}</span>
      <button onClick={onClose}>Cerrar Editar</button>
    </div>
  )
}));

vi.mock('../../pantallas/SeccionAdministrador/FormulariosAdmisnitrador/Fromulario/FomrularioComuna/FormularioCrearComunaAdmin', () => ({
  default: ({ onClose }) => (
    <div data-testid="mock-modal-crear">
      <span>Formulario de Creación</span>
      <button onClick={onClose}>Cerrar Crear</button>
    </div>
  )
}));

// Mock Data de comunas para las respuestas de la base de datos
const mockComunas = [
  { idComuna: 10, nombreComuna: 'Maipú', nombreRegion: 'Metropolitana', idRegion: 1 },
  { idComuna: 25, nombreComuna: 'Viña del Mar', nombreRegion: 'Valparaíso', idRegion: 2 }
];

// Envolvedor para simular sesión activa de Administrador
const AdminAuthWrapper = ({ children, isAdmin = true }) => (
  <AuthContext.Provider value={{ 
    usuario: { idUsuario: 1, habilitadorAdministrador: isAdmin, pNombre: 'Admin' }, 
    token: 'token-seguro-admin-123' 
  }}>
    {children}
  </AuthContext.Provider>
);

describe('Test de Integración - Pantalla Administrador de Comunas', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Simulamos las funciones nativas de confirmación y alertas del navegador
    window.confirm = vi.fn();
    window.alert = vi.fn();
    
    // Por defecto, simulamos que la API devuelve los registros exitosamente
    comunasService.getAllComunas.mockResolvedValue(mockComunas);
  });

  it('Debe redirigir a /home si el usuario no tiene rol de Administrador', async () => {
    render(
      <BrowserRouter>
        <AdminAuthWrapper isAdmin={false}>
          <PantallaAdministradorComunas />
        </AdminAuthWrapper>
      </BrowserRouter>
    );

    // Verifica la cláusula de salvaguarda del useEffect
    expect(mockNavigate).toHaveBeenCalledWith('/home');
  });

  it('Debe renderizar la tabla con todos los datos de las comunas correctamente', async () => {
    render(
      <BrowserRouter>
        <AdminAuthWrapper isAdmin={true}>
          <PantallaAdministradorComunas />
        </AdminAuthWrapper>
      </BrowserRouter>
    );

    // Esperamos a que el useEffect termine de resolver la promesa asíncrona de carga
    await waitFor(() => expect(comunasService.getAllComunas).toHaveBeenCalled());

    // Corroboramos títulos de columnas y textos dinámicos cargados
    expect(screen.getByText('Tabla de Comunas')).toBeInTheDocument();
    expect(screen.getByText('Maipú')).toBeInTheDocument();
    expect(screen.getByText('Metropolitana')).toBeInTheDocument();
    expect(screen.getByText('Viña del Mar')).toBeInTheDocument();
    expect(screen.getByText('Valparaíso')).toBeInTheDocument();
  });

  it('Debe filtrar los registros de la tabla basándose en el término de búsqueda', async () => {
    render(
      <BrowserRouter>
        <AdminAuthWrapper isAdmin={true}>
          <PantallaAdministradorComunas />
        </AdminAuthWrapper>
      </BrowserRouter>
    );

    await waitFor(() => expect(comunasService.getAllComunas).toHaveBeenCalled());

    // Buscamos la barra de texto por su placeholder
    const inputBusqueda = screen.getByPlaceholderText(/Buscar comuna o región.../i);
    
    // Simulamos que el usuario escribe "Viña"
    fireEvent.change(inputBusqueda, { target: { value: 'Viña' } });

    // Maipú debe desaparecer de la vista filtrada, Viña del Mar debe mantenerse
    expect(screen.getByText('Viña del Mar')).toBeInTheDocument();
    expect(screen.queryByText('Maipú')).not.toBeInTheDocument();
  });

  it('Debe abrir el modal de creación al hacer clic en el botón "+ Crear Comuna"', async () => {
    render(
      <BrowserRouter>
        <AdminAuthWrapper isAdmin={true}>
          <PantallaAdministradorComunas />
        </AdminAuthWrapper>
      </BrowserRouter>
    );

    await waitFor(() => expect(comunasService.getAllComunas).toHaveBeenCalled());

    const botonCrear = screen.getByRole('button', { name: /\+ Crear Comuna/i });
    fireEvent.click(botonCrear);

    // Verificamos que el componente condicional ahora está montado en el DOM
    expect(screen.getByTestId('mock-modal-crear')).toBeInTheDocument();
  });

  it('Debe abrir el modal de edición pasándole el ID correcto al seleccionar "Editar"', async () => {
    render(
      <BrowserRouter>
        <AdminAuthWrapper isAdmin={true}>
          <PantallaAdministradorComunas />
        </AdminAuthWrapper>
      </BrowserRouter>
    );

    await waitFor(() => expect(comunasService.getAllComunas).toHaveBeenCalled());

    // Obtenemos todos los selectores de acciones (habrá uno por cada fila)
    const selectoresAcciones = screen.getAllByRole('combobox');
    
    // Seleccionamos "editar" en el menú de la primera comuna (Maipú, ID: 10)
    fireEvent.change(selectoresAcciones[0], { target: { value: 'editar' } });

    // Verificamos que se abre el modal reflejando el ID enviado por parámetro
    expect(screen.getByTestId('mock-modal-editar')).toBeInTheDocument();
    expect(screen.getByText('Editando Comuna ID: 10')).toBeInTheDocument();
  });

  it('Debe ejecutar el ciclo de eliminación completo con éxito (Confirmar -> Llamar API -> Alerta de éxito -> Recargar)', async () => {
    // 1. Configuramos los mocks específicos para este flujo
    window.confirm.mockReturnValue(true); // El usuario hace clic en "Aceptar" en el cuadro de confirmación
    comunasService.deleteComuna.mockResolvedValue(true); // La API responde 204/200 con éxito

    render(
      <BrowserRouter>
        <AdminAuthWrapper isAdmin={true}>
          <PantallaAdministradorComunas />
        </AdminAuthWrapper>
      </BrowserRouter>
    );

    // Esperamos la carga inicial
    await waitFor(() => expect(comunasService.getAllComunas).toHaveBeenCalled());

    const selectoresAcciones = screen.getAllByRole('combobox');
    
    // 2. Disparamos la acción de eliminar en la primera fila (Maipú, ID: 10)
    fireEvent.change(selectoresAcciones[0], { target: { value: 'eliminar' } });

    // 3. Verificaciones de seguridad y flujo secuencial:
    // Comprobar que saltó el cuadro de confirmación nativo del navegador
    expect(window.confirm).toHaveBeenCalledWith('¿Estás seguro de que deseas eliminar esta comuna?');
    
    // Comprobar que llamó al servicio borrando el ID 10 e incrustando el Token de Admin del Contexto
    expect(comunasService.deleteComuna).toHaveBeenCalledWith(10, 'token-seguro-admin-123');

    // Comprobar que se notificó al operador con el alert de éxito escrito en tu componente
    await waitFor(() => {
      expect(window.alert).toHaveBeenCalledWith('Comuna eliminada correctamente.');
    });

    // Comprobar que la pantalla volvió a ejecutar cargarComunas() para refrescar los cambios de la grilla
    // (Debe haberse llamado 2 veces: 1 al montar el componente + 1 después del borrado)
    expect(comunasService.getAllComunas).toHaveBeenCalledTimes(2);
  });
});