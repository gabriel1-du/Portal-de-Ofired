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

        // LOGS DE DEPURACIÓN PROFUNDA PARA LA NUBE
        System.out.println("🚀 [JwtFilter] Petición entrante interceptada:");
        System.out.println("   - URI: " + request.getRequestURI());
        System.out.println("   - ServletPath: " + request.getServletPath());
        System.out.println("   - METHOD: " + request.getMethod());
        System.out.println("   - Origin (CORS): " + request.getHeader("Origin"));

        // Si la petición es para el endpoint de login, la dejamos pasar sin procesar el token.
        // en otras palabras cada vez que se inicie sesion devuelve el token sin necesidad de validarlo, ya que no existe en ese momento
        String path = request.getServletPath();
        // Usamos startsWith en lugar de equals por si Render añade un "/" al final de la URL
        if (path.startsWith("/api/auth/login") || path.startsWith("/api/auth/recuperacion/generar-token")) {
            System.out.println("🔓 [JwtFilter] Ruta pública detectada. Omitiendo validación JWT y permitiendo paso.");
            filterChain.doFilter(request, response);
            return;
        }

        final String authHeader = request.getHeader("Authorization");

        // Si no hay cabecera de autorización o no es un token Bearer,
        // simplemente continuamos la cadena. Spring Security decidirá después si la ruta
        // es pública (permitAll) o si debe denegar el acceso (403 Forbidden).
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            System.out.println("⚠️ [JwtFilter] No se encontró Token Bearer en la petición. Se continuará la cadena.");
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
            try {
                
                UserDetails userDetails = this.userDetailsService.loadUserByUsername(username);
                // Si el token es válido, establecemos la autenticación en el contexto de seguridad para que Spring Security lo reconozca como un usuario autenticado.
                UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(
                        userDetails, null, userDetails.getAuthorities());
                authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                SecurityContextHolder.getContext().setAuthentication(authToken);
                System.out.println("✅ Usuario '" + username + "' autenticado por token.");
            } catch (Exception e) {
                // Si el usuario del token no se encuentra o el token es inválido,
                // simplemente lo registramos y continuamos. Si la ruta es pública,
                // Spring Security la permitirá. Si es protegida, la denegará
                // porque no se estableció ninguna autenticación.
                System.out.println("⚠️ No se pudo autenticar al usuario del token: " + e.getMessage());
            }
        }

        filterChain.doFilter(request, response);
    }
}
