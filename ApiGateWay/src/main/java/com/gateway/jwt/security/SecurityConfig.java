package com.gateway.jwt.security;

import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.*;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;

import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.http.HttpMethod; // Asegúrate de importar esto arriba
import static com.gateway.jwt.security.PublicRoutes.*; //importa las rutas publicas de jwt
import static com.gateway.redireccionApis.ApiUsuarios.UsuarioPublicRoutes.USUARIO_PUBLIC_GET; //Importa las rutas publicas de usuario

import java.util.Arrays;


@Configuration
@RequiredArgsConstructor
public class SecurityConfig {

    private final JwtFilter jwtFilter;
    private final UserDetailsServiceImpl userDetailsService;

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        return http.csrf(csrf -> csrf.disable())
            .cors(cors -> cors.configurationSource(corsConfigurationSource())) // <-- ESTO FALTA
            .csrf(csrf -> csrf.disable())
            .authorizeHttpRequests(auth -> auth

                // URL públicas JWT
                .requestMatchers(HttpMethod.POST, PUBLIC_POST).permitAll() // rutas publicas POST de PublicRoutes de JWT
                .requestMatchers(HttpMethod.GET, PUBLIC_GET).permitAll() // rutas publicas GET de PublicRoutes de JWT

                // URL públicas API Gestion
                .requestMatchers(HttpMethod.GET, USUARIO_PUBLIC_GET).permitAll()   // lista pública api GESTION GET
                .requestMatchers(HttpMethod.POST, "/api/proxy/usuariosApi/**").permitAll()

                // Otras URL Token obligatorio
                .anyRequest().authenticated()

            )
            .authenticationProvider(authenticationProvider(passwordEncoder()))
            .addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class)
            .build();
    }


    @Bean
    public AuthenticationManager authenticationManager(AuthenticationProvider provider) {
        return new ProviderManager(provider);
    }

    @Bean
    public BCryptPasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public AuthenticationProvider authenticationProvider(BCryptPasswordEncoder passwordEncoder) {
        DaoAuthenticationProvider provider = new DaoAuthenticationProvider();
        provider.setUserDetailsService(userDetailsService);
        provider.setPasswordEncoder(passwordEncoder);
        return provider;
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        // El puerto 5173 es el de tu React/Vite
        configuration.setAllowedOrigins(Arrays.asList("http://localhost:5173")); 
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        configuration.setAllowedHeaders(Arrays.asList("Authorization", "Content-Type", "Accept"));
        configuration.setAllowCredentials(true); // Permitir que viajen los tokens/cookies

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
}
