package com.gateway.jwt.security;

import jakarta.servlet.*;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import io.micrometer.common.lang.NonNull;
import java.io.IOException;

@Component
@RequiredArgsConstructor
public class JwtFilter extends OncePerRequestFilter {

    private final JwtUtil jwtUtil;
    private final UserDetailsServiceImpl userDetailsService;

    @Override
    protected void doFilterInternal(
            @NonNull HttpServletRequest request,
            @NonNull HttpServletResponse response,
            @NonNull FilterChain filterChain) throws ServletException, IOException {

        // Imprimimos la ruta interceptada para depuración, como solicitaste.
        System.out.println("➡️ Filtro JWT interceptando - PATH: " + request.getRequestURI() + "  METHOD: " + request.getMethod());

        // Si la petición es para el endpoint de login, la dejamos pasar sin procesar el token.
        // en otras palabras cada vez que se inicie sesion devuelve el token sin necesidad de validarlo, ya que no existe en ese momento
        if (request.getServletPath().equals("/api/auth/login")) {
            filterChain.doFilter(request, response);
            return;
        }

        final String authHeader = request.getHeader("Authorization");

        // Si no hay cabecera de autorización o no es un token Bearer,
        // simplemente continuamos la cadena. Spring Security decidirá después si la ruta
        // es pública (permitAll) o si debe denegar el acceso (403 Forbidden).
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            filterChain.doFilter(request, response);
            return;
        }

        final String token = authHeader.substring(7);
        final String username;

        try {
            username = jwtUtil.extractUsername(token);
        } catch (Exception e) {
            // Si el token es inválido (expirado, malformado), no hacemos nada y continuamos.
            // Spring Security denegará el acceso si la ruta no es pública.
            filterChain.doFilter(request, response);
            return;
        }

        // Si tenemos un usuario y no está ya autenticado en el contexto de seguridad
        if (username != null && SecurityContextHolder.getContext().getAuthentication() == null) {
            // Aquí es donde ocurre tu error si el usuario del token no existe en la BD del Gateway
            UserDetails userDetails = this.userDetailsService.loadUserByUsername(username);

            // Si el token es válido, establecemos la autenticación en el contexto
            UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(
                    userDetails, null, userDetails.getAuthorities());
            authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
            SecurityContextHolder.getContext().setAuthentication(authToken);
            System.out.println("✅ Usuario '" + username + "' autenticado por token.");
        }

        filterChain.doFilter(request, response);
    }
}
