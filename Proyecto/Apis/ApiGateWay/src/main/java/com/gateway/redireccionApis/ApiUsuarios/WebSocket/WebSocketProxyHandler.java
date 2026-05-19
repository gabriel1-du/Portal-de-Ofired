package com.gateway.redireccionApis.ApiUsuarios.WebSocket;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.*;
import org.springframework.web.socket.client.standard.StandardWebSocketClient;
import org.springframework.web.socket.handler.AbstractWebSocketHandler;

import java.net.URI;
import java.util.Arrays;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Component
public class WebSocketProxyHandler extends AbstractWebSocketHandler implements SubProtocolCapable {

    private final StandardWebSocketClient client = new StandardWebSocketClient();
    
    // Mapa para relacionar la sesión del Frontend en el Gateway, con la sesión del Gateway hacia el Backend
    private final Map<String, WebSocketSession> backendSessions = new ConcurrentHashMap<>();

    @Value("${services.mensajes.websocket.base-url}")
    private String wsBaseUrl;

    @Value("${services.mensajes.websocket.base-path}")
    private String wsBasePath;

    // Indicamos al Gateway que debe responder al frontend que soportamos los subprotocolos STOMP
    @Override
    public List<String> getSubProtocols() {
        return Arrays.asList("v10.stomp", "v11.stomp", "v12.stomp");
    }

    @Override
    public void afterConnectionEstablished(WebSocketSession frontendSession) throws Exception {
        // Quitamos la parte del gateway para dejar solo la ruta original
        String originalPath = frontendSession.getUri().getRawPath().replace("/api/proxy/mensajes-webApi", "");
        String query = frontendSession.getUri().getQuery();
        
        // Construimos la URL objetivo (forzando ws://) + el base path (/ws-chat) + el resto
        String targetUriStr = wsBaseUrl.replace("http://", "ws://").replace("https://", "wss://") + wsBasePath + originalPath + (query != null ? "?" + query : "");
        URI targetUri = new URI(targetUriStr);

        System.out.println("WEBSOCKET Proxy redirigiendo a: " + targetUri);

        // Propagamos los subprotocolos STOMP que envía el frontend
        WebSocketHttpHeaders headers = new WebSocketHttpHeaders();
        List<String> subProtocols = frontendSession.getHandshakeHeaders().get("Sec-WebSocket-Protocol");
        if (subProtocols != null && !subProtocols.isEmpty()) {
            headers.put("Sec-WebSocket-Protocol", subProtocols);
        }

        // Creamos el cliente que escuchará lo que responde el microservicio de chat
        WebSocketHandler backendHandler = new AbstractWebSocketHandler() {
            @Override
            public void handleMessage(WebSocketSession session, WebSocketMessage<?> message) throws Exception {
                if (frontendSession.isOpen()) {
                    frontendSession.sendMessage(message); // Envía respuesta al frontend
                }
            }

            @Override
            public void afterConnectionClosed(WebSocketSession session, CloseStatus status) throws Exception {
                if (frontendSession.isOpen()) {
                    frontendSession.close(status);
                }
                backendSessions.remove(frontendSession.getId());
            }
        };

        try {
            // Se abre la conexión como cliente hacia tu backend
            WebSocketSession backendSession = client.execute(backendHandler, headers, targetUri).get();
            backendSessions.put(frontendSession.getId(), backendSession);
        } catch (Exception e) {
            System.err.println("Error conectando con el backend WebSocket: " + e.getMessage());
            frontendSession.close(CloseStatus.SERVER_ERROR);
        }
    }

    @Override
    public void handleMessage(WebSocketSession frontendSession, WebSocketMessage<?> message) throws Exception {
        // Recibe mensaje del frontend y lo reenvía al backend
        WebSocketSession backendSession = backendSessions.get(frontendSession.getId());
        if (backendSession != null && backendSession.isOpen()) {
            backendSession.sendMessage(message);
        }
    }

    @Override
    public void afterConnectionClosed(WebSocketSession frontendSession, CloseStatus status) throws Exception {
        // Si el cliente se desconecta, cerramos la conexión con el backend
        WebSocketSession backendSession = backendSessions.remove(frontendSession.getId());
        if (backendSession != null && backendSession.isOpen()) {
            backendSession.close(status);
        }
    }

}
