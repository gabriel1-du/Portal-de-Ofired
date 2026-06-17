package com.gateway.recuperacionContrasena;

import com.gateway.jwt.security.JwtUtil;
import com.gateway.recuperacionContrasena.RecuperacionRequest;
import com.gateway.recuperacionContrasena.RecuperacionResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class RecuperacionService {

    private final JwtUtil jwtUtil;

    public RecuperacionResponse generarTokenPorCorreo(RecuperacionRequest request) {
        // Generamos el token de recuperación directamente usando el correo recibido.
        // Se asigna el rol "user" y un ID genérico (0) por defecto para estructurar el JWT.
        String token = jwtUtil.generateToken(request.getEmail(), "user", 0);
        return new RecuperacionResponse(token);
    }
}