package com.example.publicacionesApi.RestClient;

import com.example.publicacionesApi.RestClientDTO.RegionExternoDTO;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatusCode;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClient;

@Component
public class RegionRestClient {

    private final RestClient restClient;

    public RegionRestClient(@Value("${api.usuarios.url}") String baseUrl) {
        String urlControlador = baseUrl.endsWith("/") ? baseUrl + "regionesApi" : baseUrl + "/regionesApi";
        
        this.restClient = RestClient.builder()
                .baseUrl(urlControlador)
                .build();
    }

    public RegionExternoDTO obtenerRegionPorId(Integer id) {
        return restClient.get()
                .uri("/{id}", id)
                .retrieve()
                .onStatus(HttpStatusCode::is4xxClientError, (request, response) -> {
                    throw new RuntimeException("Error 4xx: Región con ID " + id + " no encontrada.");
                })
                .onStatus(HttpStatusCode::is5xxServerError, (request, response) -> {
                    throw new RuntimeException("Error 5xx: Fallo interno en la API de Regiones.");
                })
                .body(RegionExternoDTO.class);
    }
}
