package com.gateway.redireccionApis.publicacionesApis;

import org.springframework.http.HttpEntity;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.HttpServerErrorException;
import org.springframework.web.client.RestTemplate;

import com.gateway.jwt.service.JwtService;

import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.beans.factory.annotation.Value;


@RestController
@RequestMapping("/api/proxy/reseniasApi")
@RequiredArgsConstructor
public class ReseniasProxyController {

    
    private final RestTemplate restTemplate;
    private final JwtService jwtService;

    @Value("${services.publicaciones.base-url}")
    private String reseniasBaseUrl;

    @Value("${services.publicaciones.base-path}")
    private String reseniasBasePath;

    @RequestMapping(value = {"", "/**"}, method = {RequestMethod.GET, RequestMethod.POST, RequestMethod.PUT, RequestMethod.DELETE})
    public ResponseEntity<?> proxyResenias(HttpServletRequest request,
                                                 @RequestBody(required = false) String body,
                                                 @RequestHeader HttpHeaders headers) {
        return handleProxy(request, body, headers);
    }

    private ResponseEntity<?> handleProxy(HttpServletRequest request, String body, HttpHeaders headers) {
        String originalPath = request.getRequestURI().replace("/api/proxy/reseniasApi", "");

        String targetUrl = org.springframework.web.util.UriComponentsBuilder
                .fromHttpUrl(reseniasBaseUrl)
                .path(reseniasBasePath)
                .path(originalPath)
                .build(true)
                .toUriString();

        HttpMethod method = HttpMethod.valueOf(request.getMethod());
        System.out.println("RESENIAS targetUrl: " + targetUrl + "  METHOD: " + method);

        if (method == HttpMethod.POST || method == HttpMethod.PUT || method == HttpMethod.DELETE) {
            String authHeader = headers.getFirst(HttpHeaders.AUTHORIZATION);
            if (authHeader == null || !authHeader.startsWith("Bearer ")) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .contentType(MediaType.APPLICATION_JSON)
                        .body("{\"error\": \"Token no presente o inválido\"}");
            }
    
            String token = authHeader.replace("Bearer ", "");
            String rol = jwtService.extractClaim(token, claims -> {
                String r = claims.get("rol", String.class);
                if (r == null) r = claims.get("role", String.class);
                return r;
            });
    
            if (method == HttpMethod.POST || method == HttpMethod.PUT) {
                if (!"user".equalsIgnoreCase(rol)) {
                    return ResponseEntity.status(HttpStatus.FORBIDDEN)
                            .contentType(MediaType.APPLICATION_JSON)
                            .body("{\"error\": \"Operación restringida a usuarios.\"}");
                }
            }

            if (method == HttpMethod.DELETE) {
                if (!"admin".equalsIgnoreCase(rol)) {
                    return ResponseEntity.status(HttpStatus.FORBIDDEN)
                            .contentType(MediaType.APPLICATION_JSON)
                            .body("{\"error\": \"Operación restringida a administradores.\"}");
                }
            }
        }

        HttpHeaders cleanHeaders = new HttpHeaders();
        headers.forEach((key, value) -> {
            if (!key.equalsIgnoreCase(HttpHeaders.CONTENT_LENGTH)) {
                cleanHeaders.put(key, value);
            }
        });
        cleanHeaders.setContentType(MediaType.APPLICATION_JSON);

        HttpEntity<String> entity = new HttpEntity<>(body, cleanHeaders);

        try {
            ResponseEntity<String> response = restTemplate.exchange(targetUrl, method, entity, String.class);
            return ResponseEntity.status(response.getStatusCode()).contentType(MediaType.APPLICATION_JSON).body(response.getBody());
        } catch (HttpClientErrorException | HttpServerErrorException ex) {
            return ResponseEntity.status(ex.getStatusCode()).contentType(MediaType.APPLICATION_JSON).body(ex.getResponseBodyAsString());
        } catch (Exception ex) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).contentType(MediaType.APPLICATION_JSON).body("{\"error\": \"Error inesperado en el API Gateway\", \"detalle\": \"" + ex.getMessage() + "\"}");
        }
    }
}
