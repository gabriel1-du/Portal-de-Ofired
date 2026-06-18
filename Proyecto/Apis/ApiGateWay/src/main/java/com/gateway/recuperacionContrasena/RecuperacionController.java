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
        System.out.println("🎯 [RecuperacionController] Petición recibida en el endpoint de recuperación.");
        System.out.println("   - Correo proporcionado: " + request.getEmail());

        try {
            // 1. Generar el token de recuperación usando el servicio que creamos antes
            RecuperacionResponse response = recuperacionService.generarTokenPorCorreo(request);
            System.out.println("   - Token generado exitosamente para el correo.");
            
            // 2. Enviar el correo pasándole el email de la solicitud y el token recién generado
            emailService.enviarCorreoRecuperacion(request.getEmail(), response.getToken());
            System.out.println("   - Correo enviado exitosamente mediante JavaMailSender.");
            
            return response;
        } catch (Exception e) {
            System.err.println("❌ [RecuperacionController] Error procesando la recuperación: " + e.getMessage());
            e.printStackTrace();
            throw e; // Relanzamos el error para que responda al cliente
        }
    }
}