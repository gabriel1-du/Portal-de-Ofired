package com.gateway.redireccionApis.publicacionesApis;

import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.HttpServerErrorException;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.bind.annotation.RestController;

import com.gateway.jwt.service.JwtService;

import java.net.URI;

import org.springframework.beans.factory.annotation.Value;

import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/proxy/respuestasReseniasApi")
@RequiredArgsConstructor
public class RespuestasReseniasProxyController {

    private final RestTemplate restTemplate;
    private final JwtService jwtService;

    @Value("${services.respuestas.resenias.base-url}")
    private String respuestasBaseUrl;

    @Value("${services.respuestas.resenias.base-path}")
    private String respuestasBasePath;

    @RequestMapping(value = {"", "/**"}, method = {RequestMethod.GET})
    public ResponseEntity<?> proxyRespuestasPublic(HttpServletRequest request,
                                                     @RequestHeader HttpHeaders headers) {
        return handleProxy(request, null, headers);
    }

    @RequestMapping(value = {"", "/**"}, method = {RequestMethod.POST, RequestMethod.PUT, RequestMethod.DELETE})
    public ResponseEntity<?> proxyRespuestasSecure(HttpServletRequest request,
                                                     @RequestBody(required = false) String body,
                                                     @RequestHeader HttpHeaders headers) {
        return handleProxy(request, body, headers);
    }

    private ResponseEntity<?> handleProxy(HttpServletRequest request, String body, HttpHeaders headers) {
        String originalPath = request.getRequestURI().replace("/api/proxy/respuestasReseniasApi", "");
        String queryString = request.getQueryString();

        var uriBuilder = org.springframework.web.util.UriComponentsBuilder
                .fromHttpUrl(respuestasBaseUrl)
                .path(respuestasBasePath)
                .path(originalPath);

        if (queryString != null) {
            uriBuilder.query(queryString);
        }

        URI targetUri = uriBuilder.build(true).toUri();
        HttpMethod method = HttpMethod.valueOf(request.getMethod());
        System.out.println("RESPUESTAS RESENIAS targetUrl: " + targetUri + "  METHOD: " + method);

        if (method == HttpMethod.POST || method == HttpMethod.DELETE || method == HttpMethod.PUT) {
            String authHeader = headers.getFirst(HttpHeaders.AUTHORIZATION);
            if (authHeader == null || !authHeader.startsWith("Bearer ")) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .contentType(MediaType.APPLICATION_JSON)
                        .body("{\"error\": \"Token no presente o inválido\"}");
            }
        }

        HttpHeaders cleanHeaders = new HttpHeaders();
        headers.forEach((key, value) -> {
            if (!key.equalsIgnoreCase(HttpHeaders.CONTENT_LENGTH)) {
                cleanHeaders.put(key, value);
            }
        });

        final String authHeaderForUserId = headers.getFirst(HttpHeaders.AUTHORIZATION);
        if (authHeaderForUserId != null && authHeaderForUserId.startsWith("Bearer ")) {
            try {
                String token = authHeaderForUserId.substring(7);
                Integer userId = jwtService.extractClaim(token, claims -> claims.get("userId", Integer.class));
                if (userId != null) {
                    cleanHeaders.add("X-User-ID", userId.toString());
                    System.out.println("-> Propagando cabecera X-User-ID: " + userId + " al servicio de respuestas reseñas.");
                }
            } catch (Exception e) {
                System.out.println("Advertencia: No se pudo extraer 'userId' del token para propagación. " + e.getMessage());
            }
        }

        if (method != HttpMethod.GET) {
            cleanHeaders.setContentType(MediaType.APPLICATION_JSON);
        }

        HttpEntity<String> entity = new HttpEntity<>(body, cleanHeaders);

        try {
            ResponseEntity<String> response = restTemplate.exchange(targetUri, method, entity, String.class);
            return ResponseEntity.status(response.getStatusCode())
            .contentType(MediaType.APPLICATION_JSON)
            .body(response.getBody());
        } catch (HttpClientErrorException | HttpServerErrorException ex) {
            return ResponseEntity.status(ex.getStatusCode())
                    .contentType(MediaType.APPLICATION_JSON)
                    .body(ex.getResponseBodyAsString());
        } catch (Exception ex) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .contentType(MediaType.APPLICATION_JSON)
                    .body("{\"error\": \"Error inesperado en el API Gateway\", \"detalle\": \"" + ex.getMessage() + "\"}");
        }
    }
}