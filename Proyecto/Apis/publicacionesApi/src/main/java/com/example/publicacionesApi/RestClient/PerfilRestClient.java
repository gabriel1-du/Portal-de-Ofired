package com.example.publicacionesApi.RestClient;

import com.example.publicacionesApi.RestClientDTO.PerfilExternoDTO;
import com.example.publicacionesApi.RestClientDTO.actualizarPerfilDTO;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatusCode;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClient;

@Component
public class PerfilRestClient {

    private final RestClient restClient;

    public PerfilRestClient(@Value("${api.usuarios.url}") String baseUrl) {
        String urlControlador = baseUrl.endsWith("/") ? baseUrl + "perfilesApi" : baseUrl + "/perfilesApi";
        
        this.restClient = RestClient.builder()
                .baseUrl(urlControlador)
                .build();
    }

    public PerfilExternoDTO obtenerPerfilPorUsuario(Integer idUsuario) {
        return restClient.get()
                .uri("/usuario/{idUsuario}", idUsuario)
                .retrieve()
                .onStatus(HttpStatusCode::is4xxClientError, (request, response) -> {
                    throw new RuntimeException("Error 4xx: Perfil para el usuario con ID " + idUsuario + " no encontrado.");
                })
                .onStatus(HttpStatusCode::is5xxServerError, (request, response) -> {
                    throw new RuntimeException("Error 5xx: Fallo interno en la API de Perfiles al buscar perfil.");
                })
                .body(PerfilExternoDTO.class);
    }

    public void actualizarPerfil(Integer id, actualizarPerfilDTO dto) {
        restClient.put()
                .uri("/{id}", id)
                .body(dto)
                .retrieve()
                .onStatus(HttpStatusCode::is4xxClientError, (request, response) -> {
                    throw new RuntimeException("Error 4xx: Perfil con ID " + id + " no encontrado o petición inválida al actualizar.");
                })
                .onStatus(HttpStatusCode::is5xxServerError, (request, response) -> {
                    throw new RuntimeException("Error 5xx: Fallo interno en la API de Perfiles al actualizar.");
                })
                .toBodilessEntity();
    }
}