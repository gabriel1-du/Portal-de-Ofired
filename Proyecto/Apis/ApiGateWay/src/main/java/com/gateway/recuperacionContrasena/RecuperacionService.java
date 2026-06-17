package com.gateway.recuperacionContrasena;

import com.gateway.jwt.model.Usuario;
import com.gateway.jwt.repository.UsuarioRepository;
import com.gateway.jwt.security.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class RecuperacionService {

    private final UsuarioRepository usuarioRepository;
    private final JwtUtil jwtUtil;

    public RecuperacionResponse generarTokenPorCorreo(RecuperacionRequest request) {
        // 1. Buscamos al usuario solo por su correo electrónico (utilizando tu repositorio del JWT)
        Usuario usuario = usuarioRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado con el correo: " + request.getEmail()));

        // 2. Determinamos su rol para el payload del JWT
        String rol = Boolean.TRUE.equals(usuario.getAdmin()) ? "admin" : "user";
        
        // 3. Generamos el token de acceso usando el utilitario que ya tienes
        String token = jwtUtil.generateToken(usuario.getEmail(), rol, usuario.getId());
        return new RecuperacionResponse(token);
    }
}