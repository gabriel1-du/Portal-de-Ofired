import { Client } from '@stomp/stompjs';

// Tu variable de entorno apuntando al Gateway
const BASE_URL = import.meta.env.VITE_GENERAL_WEBSOCKET_URL || '';

// Transformamos la URL HTTP a WS para conectar con WebSocket nativo puro
const WEBSOCKET_URL = BASE_URL.replace(/^http/, 'ws');


let stompClient = null;
let currentSubscription = null;

export const conectarBloqueosWebSocket = (idUsuario, onEventoBloqueo) => {
  if (stompClient && stompClient.active) {
    return; // Evita conexiones duplicadas
  }

  // Usamos el cliente moderno de STOMP (Igual que en tu servicio de Chat)
  stompClient = new Client({
    brokerURL: WEBSOCKET_URL,
    reconnectDelay: 5000,
    heartbeatIncoming: 4000,
    heartbeatOutgoing: 4000,
  });

  stompClient.onConnect = () => {
    console.log('Conectado al WebSocket de Bloqueos');

    // Aquí está la magia: Escuchamos el canal EXCLUSIVO del usuario logueado
    const canal = `/topic/bloqueos/${idUsuario}`;
    
    currentSubscription = stompClient.subscribe(canal, (mensaje) => {
      if (mensaje.body) {
        const datosBloqueo = JSON.parse(mensaje.body);
        console.log("¡Evento WebSocket recibido!", datosBloqueo);
        
        // Le pasamos los datos del bloqueo a React para que reaccione altiro
        onEventoBloqueo(datosBloqueo);
      }
    });
  };

  stompClient.onStompError = (frame) => {
    console.error('Error WebSocket Bloqueos:', frame.headers['message']);
  };

  stompClient.activate();
};

export const desconectarBloqueosWebSocket = () => {
  if (currentSubscription) {
    currentSubscription.unsubscribe();
  }
  if (stompClient) {
    stompClient.deactivate();
  }
  currentSubscription = null;
  stompClient = null;
};
