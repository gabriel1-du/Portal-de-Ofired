package com.example.publicacionesApi.DTO.ComentariosDTO;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class LeerComentarioDTO {
    private Integer idComentario;
    private Integer idPublicacion;
    private Integer idUsuario;
    private String contenido;
    private LocalDateTime fechaComentario;
}
