package com.example.publicacionesApi.DTO.RespuestasComentariosDTO;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class LeerRespuestaComentarioDTO {
    private Integer idRespuesta;
    private Integer idComentario;
    private Integer idUsuario;
    private String contenido;
    private LocalDateTime fechaRespuesta;
}