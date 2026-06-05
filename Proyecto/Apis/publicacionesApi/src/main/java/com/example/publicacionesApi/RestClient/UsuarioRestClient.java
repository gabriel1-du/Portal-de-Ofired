package com.example.publicacionesApi.RestClient;

import com.example.publicacionesApi.RestClientDTO.actualizarUserDTO;
import com.example.publicacionesApi.RestClientDTO.UsuarioExternoDTO;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.MediaType;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClient;

@Component
public class UsuarioRestClient {

    private final RestClient restClient;

    public UsuarioRestClient(@Value("${api.usuarios.url}") String baseUrl) {
        // baseUrl trae "http://localhost:8080/api/"
        // Queremos asegurarnos de que termine con "/usuariosApi" para apuntar al controlador correcto
        String urlControlador = baseUrl.endsWith("/") ? baseUrl + "usuariosApi" : baseUrl + "/usuariosApi";
        
        this.restClient = RestClient.builder()
                .baseUrl(urlControlador)
                .build();
    }

    public UsuarioExternoDTO obtenerUsuarioPorId(Integer id) {
        return restClient.get()
                .uri("/{id}", id)
                .retrieve()
                .onStatus(HttpStatusCode::is4xxClientError, (request, response) -> {
                    throw new RuntimeException("Error 4xx: Usuario con ID " + id + " no encontrado o petición inválida.");
                })
                .onStatus(HttpStatusCode::is5xxServerError, (request, response) -> {
                    throw new RuntimeException("Error 5xx: Fallo interno en la API de Usuarios.");
                })
                .body(UsuarioExternoDTO.class);
    }

    public void actualizarUsuario(Integer id, actualizarUserDTO usuarioDTO) {
        MultiValueMap<String, Object> body = new LinkedMultiValueMap<>();
        body.add("usuario", usuarioDTO); // Coincide con @RequestPart("usuario")

        restClient.put()
                .uri("/{id}", id)
                .contentType(MediaType.MULTIPART_FORM_DATA)
                .body(body)
                .retrieve()
                .onStatus(HttpStatusCode::is4xxClientError, (request, response) -> {
                    throw new RuntimeException("Error 4xx: Usuario con ID " + id + " no encontrado o petición inválida al actualizar.");
                })
                .onStatus(HttpStatusCode::is5xxServerError, (request, response) -> {
                    throw new RuntimeException("Error 5xx: Fallo interno en la API de Usuarios al actualizar.");
                })
                .toBodilessEntity();
    }
}
