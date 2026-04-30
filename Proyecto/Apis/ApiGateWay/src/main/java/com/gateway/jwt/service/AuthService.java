package com.gateway.jwt.service;

import com.gateway.jwt.dto.*;
import com.gateway.jwt.model.Usuario;
import com.gateway.jwt.repository.UsuarioRepository;
import com.gateway.jwt.security.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.*;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UsuarioRepository usuarioRepository;
    private final AuthenticationManager authManager;
    private final JwtUtil jwtUtil;

    public AuthResponse login(LoginRequest request) {
        authManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword()));

        Usuario usuario = usuarioRepository.findByEmail(request.getEmail())
                .orElseThrow();

        String rol = Boolean.TRUE.equals(usuario.getAdmin()) ? "admin" : "user";
        String token = jwtUtil.generateToken(usuario.getEmail(), rol, usuario.getId());
        return new AuthResponse(token);
    }
}
