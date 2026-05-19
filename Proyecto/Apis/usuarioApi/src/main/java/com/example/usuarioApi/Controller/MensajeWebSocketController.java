package com.example.usuarioApi.Controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

import com.example.usuarioApi.DTO.ClasesMensajesChatDTO.CrearMensajeChatDTO;
import com.example.usuarioApi.DTO.ClasesMensajesChatDTO.LeerMensajeChatFrontDTO;
import com.example.usuarioApi.Service.MensajeChatService;

@Controller // Nota: Usamos @Controller y no @RestController porque estamos manejando mensajes WebSocket, no peticiones HTTP comunes
public class MensajeWebSocketController {

    @Autowired
    private MensajeChatService mensajeChatService;

    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    /**
     * Recibe el mensaje desde el frontend, lo guarda usando el servicio 
     * y lo retransmite al canal específico de la sala de chat.
     */
    @MessageMapping("/chat.enviarMensaje")
    public void enviarMensaje(CrearMensajeChatDTO dto) {
        // 1. Guarda el mensaje en la base de datos y obtiene el DTO completo (con nombres y fechas)
        LeerMensajeChatFrontDTO mensajeGuardado = mensajeChatService.crearMensaje(dto);

        // 2. Transmite el mensaje guardado a todos los usuarios que estén suscritos al canal de ese chat
        // Si el chat es el número 5, el mensaje se enviará a "/topic/chat/5"
        String destino = "/topic/chat/" + dto.getIdChat();
        messagingTemplate.convertAndSend(destino, mensajeGuardado);
    }

}