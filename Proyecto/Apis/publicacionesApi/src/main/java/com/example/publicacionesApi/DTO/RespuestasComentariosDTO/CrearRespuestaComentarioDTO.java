package com.example.publicacionesApi.DTO.RespuestasComentariosDTO;

import lombok.Data;

@Data
public class CrearRespuestaComentarioDTO {
    private Integer idComentario;
    private Integer idUsuario;
    private String contenido;
}