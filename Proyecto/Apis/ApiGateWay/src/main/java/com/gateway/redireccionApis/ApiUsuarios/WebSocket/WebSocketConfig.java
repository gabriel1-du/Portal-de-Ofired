package com.gateway.redireccionApis.ApiUsuarios.WebSocket;

import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.socket.config.annotation.EnableWebSocket;
import org.springframework.web.socket.config.annotation.WebSocketConfigurer;
import org.springframework.web.socket.config.annotation.WebSocketHandlerRegistry;

@Configuration
@EnableWebSocket
@RequiredArgsConstructor
public class WebSocketConfig implements WebSocketConfigurer {

    private final WebSocketProxyHandler webSocketProxyHandler;
    private final WebSocketProxyHandlerGeneral webSocketProxyHandlerGeneral;

    @Override
    public void registerWebSocketHandlers(WebSocketHandlerRegistry registry) {
        // Registra el proxy para que intercepte cualquier conexión que apunte a tu web socket
        registry.addHandler(webSocketProxyHandler, "/api/proxy/mensajes-webApi/**")
                .setAllowedOrigins("*");

        // 2. Registra el nuevo proxy para las notificaciones y bloqueos
        registry.addHandler(webSocketProxyHandlerGeneral, "/api/proxy/general-webApi/**")
                .setAllowedOrigins("*");
    }
}
