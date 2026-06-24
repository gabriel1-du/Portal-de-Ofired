import '@testing-library/jest-dom';
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { BrowserRouter } from 'react-router-dom';

// Componente a testear
import PantallaAdministradorDenuncias from '../../pantallas/SeccionAdministrador/PantallaAdministradorDenuncias'; // Ajusta si la ruta de tu carpeta varía

// Contexto de autenticación
import { AuthContext } from '../../context/AuthContext';

// Servicio a mockear
import * as GaugingService from '../../servicios/ApiUsuarios/DenunciarUsuario/denunciasService';

// 1. MOCK DEL ROUTER (useNavigate)
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return { ...actual, useNavigate: () => mockNavigate };
});

// 2. MOCK DEL SERVICIO DE LA API
vi.mock('../../servicios/ApiUsuarios/DenunciarUsuario/denunciasService', () => ({
  listarDenuncias: vi.fn(),
  eliminarDenuncia: vi.fn(),
}));

// 3. MOCK DE LA BARRA LATERAL (Aislamos elementos estáticos del layout)
vi.mock('../../assets/barrasLaterales/BarraLateralAdmin', () => ({
  default: () => <div data-testid="mock-barra-lateral-admin" />
}));

// Datos simulados (Mock Data) de denuncias basados en tu DTO aplanado
const mockDenuncias = [
  {
    idDenuncia: 1,
    nombreUsuarioDenunciante: 'Juan Pérez',
    nombreTipoDenuncia: 'Vocabulario Inadecuado',
    nombreTipoContenido: 'Perfil',
    descripcionDenuncia: 'El usuario utiliza términos ofensivos en su descripción pública.',
    fechaDenuncia: '2026-06-20T14:30:00.000Z',
    nombreUsuarioDenunciado: 'Diego Silva'
  },
  {
    idDenuncia: 2,
    nombreUsuarioDenunciante: 'María Lizama',
    nombreTipoDenuncia: 'Estafa o Fraude',
    nombreTipoContenido: 'Reseña',
    descripcionDenuncia: 'Cuenta falsa creada únicamente para difamar mi trabajo cobrando dinero.',
    fechaDenuncia: '2026-06-22T09:15:00.000Z',
    nombreUsuarioDenunciado: 'Pedro Soto'
  }
];

// Envolvedor para simular el estado de la sesión del Administrador
const AdminAuthWrapper = ({ children, isAdmin = true }) => (
  <AuthContext.Provider value={{ 
    usuario: { idUsuario: 1, habilitadorAdministrador: isAdmin, pNombre: 'Admin de Turno' }, 
    token: 'token-seguro-jwt-admin' 
  }}>
    {children}
  </AuthContext.Provider>
);

describe('Test de Integración - Pantalla Administrador de Denuncias', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Simulamos ventanas emergentes nativas del navegador
    window.confirm = vi.fn();
    window.alert = vi.fn();
    
    // Configuración inicial por defecto: la API responde con la lista de denuncias
    GaugingService.listarDenuncias.mockResolvedValue(mockDenuncias);
  });

  it('Debe redirigir a /home si el usuario no es Administrador', async () => {
    render(
      <BrowserRouter>
        <AdminAuthWrapper isAdmin={false}>
          <PantallaAdministradorDenuncias />
        </AdminAuthWrapper>
      </BrowserRouter>
    );

    // Comprueba que el useEffect saca al usuario intruso de la ruta
    expect(mockNavigate).toHaveBeenCalledWith('/home');
  });

  it('Debe renderizar la tabla con toda la información detallada de las denuncias', async () => {
    render(
      <BrowserRouter>
        <AdminAuthWrapper isAdmin={true}>
          <PantallaAdministradorDenuncias />
        </AdminAuthWrapper>
      </BrowserRouter>
    );

    // Esperamos la resolución asíncrona del useEffect
    await waitFor(() => expect(GaugingService.listarDenuncias).toHaveBeenCalled());

    // Validamos la existencia de textos informativos clave en la grilla
    expect(screen.getByText('Tabla de Denuncias')).toBeInTheDocument();
    expect(screen.getByText('Juan Pérez')).toBeInTheDocument();
    expect(screen.getByText('Vocabulario Inadecuado')).toBeInTheDocument();
    expect(screen.getByText('Diego Silva')).toBeInTheDocument();
    
    expect(screen.getByText('María Lizama')).toBeInTheDocument();
    expect(screen.getByText('Estafa o Fraude')).toBeInTheDocument();
    expect(screen.getByText('Pedro Soto')).toBeInTheDocument();
  });

  it('Debe filtrar la grilla dinámicamente según el texto ingresado en la barra de búsqueda', async () => {
    render(
      <BrowserRouter>
        <AdminAuthWrapper isAdmin={true}>
          <PantallaAdministradorDenuncias />
        </AdminAuthWrapper>
      </BrowserRouter>
    );

    await waitFor(() => expect(GaugingService.listarDenuncias).toHaveBeenCalled());

    // Localizamos el campo de búsqueda por su placeholder
    const inputBusqueda = screen.placeholderText ? screen.getByPlaceholderText(/Buscar por denunciante, denunciado o tipo.../i) : screen.getByRole('textbox');
    
    // Simula que el administrador escribe "Estafa" para buscar la denuncia de María
    fireEvent.change(inputBusqueda, { target: { value: 'Estafa' } });

    // La denuncia de estafa debe continuar visible, la de vocabulario debe ser removida temporalmente
    expect(screen.getByText('Estafa o Fraude')).toBeInTheDocument();
    expect(screen.queryByText('Vocabulario Inadecuado')).not.toBeInTheDocument();
  });

  it('Debe redirigir al detalle individual de la denuncia al seleccionar "Ver Denuncia"', async () => {
    render(
      <BrowserRouter>
        <AdminAuthWrapper isAdmin={true}>
          <PantallaAdministradorDenuncias />
        </AdminAuthWrapper>
      </BrowserRouter>
    );

    await waitFor(() => expect(GaugingService.listarDenuncias).toHaveBeenCalled());

    // Obtenemos los combobox de acciones (uno por cada fila)
    const selectoresAcciones = screen.getAllByRole('combobox');
    
    // Seleccionamos la opción "ver" en la primera denuncia (ID: 1)
    fireEvent.change(selectoresAcciones[0], { target: { value: 'ver' } });

    // Verificamos la construcción correcta de la URL de destino
    expect(mockNavigate).toHaveBeenCalledWith('/admin/denuncias/1');
  });

  it('Debe procesar la eliminación completa si el Admin confirma la ventana emergente', async () => {
    // Configuramos los estados de respuesta para el flujo destructivo
    window.confirm.mockReturnValue(true); // El usuario presiona "Aceptar"
    GaugingService.eliminarDenuncia.mockResolvedValue(true); // La API responde con éxito

    render(
      <BrowserRouter>
        <AdminAuthWrapper isAdmin={true}>
          <PantallaAdministradorDenuncias />
        </AdminAuthWrapper>
      </BrowserRouter>
    );

    await waitFor(() => expect(GaugingService.listarDenuncias).toHaveBeenCalled());

    const selectoresAcciones = screen.getAllByRole('combobox');
    
    // Seleccionamos "eliminar" en la primera fila (ID: 1)
    fireEvent.change(selectoresAcciones[0], { target: { value: 'eliminar' } });

    // 1. Validar que apareció el texto exacto de confirmación en pantalla
    expect(window.confirm).toHaveBeenCalledWith('¿Estás seguro de que deseas eliminar esta denuncia? Esta acción no se puede deshacer.');

    // 2. Validar que se invocó el servicio enviando el ID correcto junto con el token JWT de administración
    expect(GaugingService.eliminarDenuncia).toHaveBeenCalledWith(1, 'token-seguro-jwt-admin');

    // 3. Validar el mensaje de éxito e inicio de recarga de la base de datos
    await waitFor(() => {
      expect(window.alert).toHaveBeenCalledWith('Denuncia eliminada correctamente.');
    });

    // Se debe haber llamado 2 veces a la API (1 al montar la pantalla + 1 para refrescar la grilla tras borrar)
    expect(GaugingService.listarDenuncias).toHaveBeenCalledTimes(2);
  });
});