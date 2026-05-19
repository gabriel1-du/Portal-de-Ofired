package com.example.usuarioApi.Controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.stereotype.Controller;

import com.example.usuarioApi.DTO.ClasesUsuariosBloqueadosDTO.CrearUsuariosBloqueadosDTO;
import com.example.usuarioApi.Service.UsuariosBloqueadosService;

@Controller
public class UsuariosBloqueadosWebSocketController {

    @Autowired
    private UsuariosBloqueadosService bloqueoService;

    /**
     * Opcional: Recibe la orden de crear un bloqueo a través del WebSocket
     * en lugar de usar el POST tradicional HTTP.
     * El cliente enviará su solicitud a: /app/bloqueos.crear
     */
    @MessageMapping("/bloqueos.crear")
    public void crearBloqueoWebsocket(CrearUsuariosBloqueadosDTO dto) {
        // Al llamar al servicio, este ya se encarga de guardar en la BD 
        // y emitir automáticamente la notificación a los canales /topic/bloqueos/{id} de ambos usuarios.
        bloqueoService.crearBloqueo(dto);
    }
}
