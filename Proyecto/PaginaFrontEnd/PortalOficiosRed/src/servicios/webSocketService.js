import { Client } from '@stomp/stompjs';


const WS_URL = import.meta.env.VITE_WEBSOCKET_CHAT_URL || '';


class WebSocketService {
  constructor() {
    this.client = null;
  }

  // 1. Conectar al servidor STOMP
  connect(token, onConnectCallback) {
    if (!WS_URL) {
      console.error("Falta VITE_WEBSOCKET_CHAT_URL en el archivo .env. No se puede conectar al Chat.");
      return;
    }

    // Convertimos la URL http/https a ws/wss para la conexión pura de WebSocket
    const brokerUrl = WS_URL.replace(/^http/, 'ws');

    this.client = new Client({
      brokerURL: brokerUrl,
      connectHeaders: {
        Authorization: `Bearer ${token}`, // Enviamos el token para la seguridad
      },
      debug: function (str) {
        console.log('STOMP: ' + str); // Útil para ver en consola cómo viajan los mensajes
      },
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
    });

    this.client.onConnect = (frame) => {
      console.log('¡Conectado a WebSockets exitosamente!');
      if (onConnectCallback) onConnectCallback();
    };

    this.client.onStompError = (frame) => {
      console.error('Error de STOMP reportado por el servidor:', frame.headers['message']);
    };

    this.client.activate();
  }

  // 2. Suscribirse a la sala de chat ("Escuchar" lo que llega)
  subscribeToChat(idChat, onMessageReceived) {
    if (this.client && this.client.connected) {
      return this.client.subscribe(`/topic/chat/${idChat}`, (message) => {
        const body = JSON.parse(message.body);
        onMessageReceived(body);
      });
    }
  }

  // 3. Enviar un mensaje nuevo
  sendMessage(dtoMensaje) {
    if (this.client && this.client.connected) {
      this.client.publish({
        // Nota: Si en Spring Boot tienes ApplicationDestinationPrefixes("/app"), añade "/app" al inicio.
        destination: '/app/chat.enviarMensaje', 
        body: JSON.stringify(dtoMensaje),
      });
    } else {
      console.error('No se pudo enviar el mensaje, el socket está desconectado.');
    }
  }

  // 4. Desconectar al salir
  disconnect() {
    if (this.client) {
      this.client.deactivate();
      console.log('Desconectado de WebSockets');
    }
  }
}

export const webSocketService = new WebSocketService();
