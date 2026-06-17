package com.gateway.recuperacionContrasena;

import com.gateway.recuperacionContrasena.RecuperacionRequest;
import com.gateway.recuperacionContrasena.RecuperacionResponse;
import com.gateway.recuperacionContrasena.RecuperacionService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth/recuperacion")
@RequiredArgsConstructor
public class RecuperacionController {

    private final RecuperacionService recuperacionService;
    private final EmailService emailService;

    @PostMapping("/generar-token")
    public RecuperacionResponse generarToken(@RequestBody RecuperacionRequest request) {
        // 1. Generar el token de recuperación usando el servicio que creamos antes
        RecuperacionResponse response = recuperacionService.generarTokenPorCorreo(request);
        
        // 2. Enviar el correo usando Mailtrap, pasándole el email de la solicitud y el token recién generado
        emailService.enviarCorreoRecuperacion(request.getEmail(), response.getToken());
        
        // 3. Retornamos el token como respuesta al frontend/Postman (opcional, pero útil para depurar)
        return response;
    }
}