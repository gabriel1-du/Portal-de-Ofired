package com.example.publicacionesApi.DTO.ComentariosDTO;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CrearComentarioDTO {
    private Integer idPublicacion;
    private Integer idUsuario;
    private String contenido;
}
