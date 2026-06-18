package com.gateway.recuperacionContrasena;

import com.gateway.jwt.model.Usuario;
import com.gateway.jwt.repository.UsuarioRepository;
import com.gateway.jwt.security.JwtUtil;
import com.gateway.recuperacionContrasena.RecuperacionRequest;
import com.gateway.recuperacionContrasena.RecuperacionResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class RecuperacionService {

    private final JwtUtil jwtUtil;
    private final UsuarioRepository usuarioRepository;

    public RecuperacionResponse generarTokenPorCorreo(RecuperacionRequest request) {
        // 1. Buscamos el usuario REAL en la base de datos usando el correo
        Usuario usuario = usuarioRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado con el correo: " + request.getEmail()));

        // 2. Determinamos el rol real (admin o user)
        String rol = Boolean.TRUE.equals(usuario.getAdmin()) ? "admin" : "user";

        // 3. Generamos el token con datos REALES del usuario
        String token = jwtUtil.generateToken(usuario.getEmail(), rol, usuario.getId());
        
        return new RecuperacionResponse(token);
    }
}