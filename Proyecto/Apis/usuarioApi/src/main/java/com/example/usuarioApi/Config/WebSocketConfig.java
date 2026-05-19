package com.example.usuarioApi.Config;

import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.web.socket.config.annotation.StompEndpointRegistry;
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;

@Configuration
@EnableWebSocketMessageBroker
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {

    @Override
    public void registerStompEndpoints(StompEndpointRegistry registry) {
        // Registra el punto de conexión inicial al que React se conectará (ej. ws://localhost:8080/ws-chat)
        // setAllowedOriginPatterns("*") permite que clientes en diferentes puertos (como React en 3000) se conecten sin problemas de CORS
        // withSockJS() habilita opciones de respaldo por si el navegador no soporta WebSockets puros
        registry.addEndpoint("/ws-chat")
                .setAllowedOriginPatterns("*")
                .withSockJS();
                
        // Nuevo endpoint con "api" en el nombre para mantener compatibilidad con tu API Gateway
        registry.addEndpoint("/ws-api")
                .setAllowedOriginPatterns("*")
                .withSockJS();
    }

    @Override
    public void configureMessageBroker(MessageBrokerRegistry registry) {
        // Habilita un broker simple en memoria.
        // Todo lo que el servidor envíe a los clientes (broadcast) empezará con "/topic"
        registry.enableSimpleBroker("/topic");
        
        // Define el prefijo para los mensajes que el cliente (React) envía hacia el servidor.
        // Por ejemplo, para usar el @MessageMapping("/chat.enviarMensaje"), el cliente enviará a "/app/chat.enviarMensaje"
        registry.setApplicationDestinationPrefixes("/app");
    }
}