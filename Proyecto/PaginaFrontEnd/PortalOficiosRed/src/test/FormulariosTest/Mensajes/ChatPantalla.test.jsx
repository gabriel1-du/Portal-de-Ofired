import '@testing-library/jest-dom';
import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { BrowserRouter } from 'react-router-dom';

// Componente a testear
import ChatPantalla from '../../../pantallas/PantallasMensajes/ChatPantalla';

// Contexto
import { AuthContext } from '../../../context/AuthContext';

// Servicios a mockear
import * as mensajesService from '../../../servicios/ApiUsuarios/SeccionChats/mensajesChatService';
import * as participantesService from '../../../servicios/ApiUsuarios/SeccionChats/participantesChatService';
import * as bloqueosService from '../../../servicios/ApiUsuarios/SeccionChats/usuariosBloqueadosService';
import { webSocketService } from '../../../servicios/ApiUsuarios/SeccionChats/webSocketService';
import { conectarBloqueosWebSocket, desconectarBloqueosWebSocket } from '../../../servicios/ApiUsuarios/SeccionChats/bloqueosWebSocketService';

// --- MOCKS ---

// 1. Router
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
    useParams: () => ({ idChat: '1' }), // Simulamos estar en el chat con ID 1
  };
});

// 2. WebSocket Service
let subscriptionCallback; // Para capturar el callback y simular mensajes entrantes
vi.mock('../../../servicios/ApiUsuarios/SeccionChats/webSocketService', () => ({
  webSocketService: {
    connect: vi.fn((token, cb) => cb()),
    subscribeToChat: vi.fn((idChat, cb) => {
      subscriptionCallback = cb;
    }),
    sendMessage: vi.fn(),
    disconnect: vi.fn(),
  },
}));

// 3. Otros servicios HTTP y WebSockets de bloqueo
vi.mock('../../../servicios/ApiUsuarios/SeccionChats/mensajesChatService');
vi.mock('../../../servicios/ApiUsuarios/SeccionChats/participantesChatService');
vi.mock('../../../servicios/ApiUsuarios/SeccionChats/usuariosBloqueadosService');
vi.mock('../../../servicios/ApiUsuarios/SeccionChats/bloqueosWebSocketService', () => ({
  conectarBloqueosWebSocket: vi.fn(),
  desconectarBloqueosWebSocket: vi.fn(),
}));

// 4. Componentes hijos complejos
vi.mock('../../../assets/barrasLaterales/BarraLateralChat', () => ({
  default: () => <div data-testid="mock-barra-lateral-chat" />,
}));

// --- CONFIGURACIÓN DEL TEST ---

const AuthWrapper = ({ children }) => (
  <AuthContext.Provider value={{ usuario: { idUsuario: 1, username: 'yo@test.com', rut: '111-1' }, token: 'fake-token' }}>
    {children}
  </AuthContext.Provider>
);

describe('Test del Componente ChatPantalla', () => {
  const otroUsuario = { idUsuario: 2, nombreUsuario: 'Juan Perez', fotoUsuario: 'juan.png', idChat: 1 };
  const mensajeInicial = { idMensajeChat: 101, idAutor: 2, mensajeTexto: 'Hola, ¿cómo estás?', fechaHoraEnvio: new Date().toISOString() };

  beforeEach(() => {
    vi.clearAllMocks();
    
    // Simulamos la función de scroll que no existe nativamente en el entorno de pruebas (jsdom)
    window.HTMLElement.prototype.scrollIntoView = vi.fn();

    // Mock de respuestas de API
    participantesService.leerTodosLosParticipantesFront.mockResolvedValue([
      { idUsuario: 1, nombreUsuario: 'Yo Mismo', fotoUsuario: 'yo.png', idChat: 1 },
      otroUsuario,
    ]);
    mensajesService.leerMensajesPorChat.mockResolvedValue([mensajeInicial]);
    bloqueosService.buscarRelacionSimultanea.mockResolvedValue({ habilitador: false });
  });

  it('Debe cargar mensajes previos y enviar uno nuevo correctamente', async () => {
    render(<BrowserRouter><AuthWrapper><ChatPantalla /></AuthWrapper></BrowserRouter>);

    // 1. Verificar que se cargaron los datos iniciales
    await waitFor(() => {
      expect(screen.getByText('Juan Perez')).toBeInTheDocument();
      expect(screen.getByText('Hola, ¿cómo estás?')).toBeInTheDocument();
    });

    // 2. Escribir y enviar un nuevo mensaje
    const input = screen.getByPlaceholderText(/Escribe un mensaje aquí/i);
    fireEvent.change(input, { target: { value: '¡Todo bien por aquí!' } });
    fireEvent.click(screen.getByRole('button', { name: /Enviar/i }));

    // 3. Verificar que se llamó al WebSocket con el DTO correcto
    await waitFor(() => {
      expect(webSocketService.sendMessage).toHaveBeenCalledWith({
        mensajeTexto: '¡Todo bien por aquí!', idChat: 1, idAutor: 1,
      });
    });
    expect(input.value).toBe(''); // El input debe limpiarse
  });

  it('Debe mostrar en pantalla un mensaje nuevo recibido por WebSocket', async () => {
    render(<BrowserRouter><AuthWrapper><ChatPantalla /></AuthWrapper></BrowserRouter>);
    await waitFor(() => expect(screen.getByText('Hola, ¿cómo estás?')).toBeInTheDocument());

    // Simulamos que el servidor nos "empuja" un mensaje nuevo
    const mensajeWebSocket = { idMensajeChat: 102, idAutor: 2, mensajeTexto: 'Qué bueno, me alegro.', fechaHoraEnvio: new Date().toISOString() };
    
    // Usamos 'act' porque esta acción causará una actualización de estado en el componente
    act(() => { subscriptionCallback(mensajeWebSocket); });

    // Verificamos que el nuevo mensaje ahora es visible en la pantalla
    await waitFor(() => {
      expect(screen.getByText('Qué bueno, me alegro.')).toBeInTheDocument();
    });
  });
});