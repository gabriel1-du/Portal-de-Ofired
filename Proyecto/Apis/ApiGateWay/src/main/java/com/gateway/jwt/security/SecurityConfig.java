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
import static com.gateway.redireccionApis.ApiUsuarios.Region.RegionPublicRoutes.REGION_PUBLIC_GET;
import static com.gateway.redireccionApis.ApiUsuarios.Comuna.ComunaPublicRoutes.COMUNA_PUBLIC_GET;
import static com.gateway.redireccionApis.ApiUsuarios.SexoUsuario.SexoUsuarioPublicRoutes.SEXO_USUARIO_PUBLIC_GET;
import static com.gateway.redireccionApis.ApiUsuarios.Oficio.OficioPublicRoutes.OFICIO_PUBLIC_GET;
import static com.gateway.redireccionApis.ApiUsuarios.Usuario.UsuarioPublicRoutes.USUARIO_PUBLIC_GET;
import static com.gateway.redireccionApis.ApiUsuarios.TiposUsuarios.TiposUsuarioPublicRoutes.TIPOS_USUARIO_PUBLIC_GET;
import static com.gateway.redireccionApis.publicacionesApis.publicacionPublicRoutes.PUBLICACION_PUBLIC_GET;
import static com.gateway.redireccionApis.ApiUsuarios.PerfilesUsuarios.PerfilesPublicRoutes.PERFILES_PUBLIC_GET;
import java.util.Arrays;


@Configuration
@RequiredArgsConstructor
public class SecurityConfig {

    private final JwtFilter jwtFilter;
    private final UserDetailsServiceImpl userDetailsService;

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        return http.csrf(csrf -> csrf.disable())
            .cors(cors -> cors.configurationSource(corsConfigurationSource()))
            .authorizeHttpRequests(auth -> auth

                // URL públicas JWT
                .requestMatchers(HttpMethod.POST, PUBLIC_POST).permitAll() // rutas publicas POST de PublicRoutes de JWT
                .requestMatchers(HttpMethod.GET, PUBLIC_GET).permitAll() // rutas publicas GET de PublicRoutes de JWT

                // URL públicas API Gestion
                .requestMatchers(HttpMethod.GET, USUARIO_PUBLIC_GET).permitAll()   // lista pública api GESTION GET
                .requestMatchers(HttpMethod.POST, "/api/proxy/usuariosApi/**").permitAll()

                // URL públicas API Regiones
                .requestMatchers(HttpMethod.GET, REGION_PUBLIC_GET).permitAll()

                // URL públicas API Comunas
                .requestMatchers(HttpMethod.GET, COMUNA_PUBLIC_GET).permitAll()

                // URL públicas API SexoUsuario
                .requestMatchers(HttpMethod.GET, SEXO_USUARIO_PUBLIC_GET).permitAll()

                // URL públicas API Oficio
                .requestMatchers(HttpMethod.GET, OFICIO_PUBLIC_GET).permitAll()

                // URL públicas API TiposUsuario
                .requestMatchers(HttpMethod.GET, TIPOS_USUARIO_PUBLIC_GET).permitAll()

                // URL públicas API Publicaciones
                .requestMatchers(HttpMethod.GET, PUBLICACION_PUBLIC_GET).permitAll()

                  // URL públicas API Perfiles
                .requestMatchers(HttpMethod.GET, PERFILES_PUBLIC_GET ).permitAll()
                

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
