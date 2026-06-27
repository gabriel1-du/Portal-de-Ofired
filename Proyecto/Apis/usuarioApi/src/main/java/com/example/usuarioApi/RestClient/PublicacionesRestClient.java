package com.example.usuarioApi.RestClient;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClient;
import org.springframework.http.HttpStatusCode;

@Component
public class PublicacionesRestClient {

    private final RestClient restClient;

    public PublicacionesRestClient(@Value("${URL_PUBLICACIONES_API:http://localhost:8085}") String baseUrl) {
        // Apunta al controlador interno que acabamos de crear en el otro microservicio
        String urlControlador = baseUrl.endsWith("/") ? baseUrl + "publicacionesApi/interno" : baseUrl + "/publicacionesApi/interno";
        this.restClient = RestClient.builder().baseUrl(urlControlador).build();
    }

    public void solicitarPurgarDatosUsuario(Integer idUsuario) {
        restClient.delete()
                .uri("/limpiar-usuario/{id}", idUsuario)
                .retrieve()
                .onStatus(HttpStatusCode::isError, (request, response) -> {
                    throw new RuntimeException("No se pudo limpiar los datos remotos del usuario en PublicacionesApi.");
                })
                .toBodilessEntity();
    }

}
