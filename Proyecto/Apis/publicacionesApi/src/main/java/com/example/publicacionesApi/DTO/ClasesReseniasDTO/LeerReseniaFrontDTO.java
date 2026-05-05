package com.example.publicacionesApi.DTO.ClasesReseniasDTO;

import lombok.Data;

@Data
public class LeerReseniaFrontDTO {

    private Integer ReseniaId;
    private String nombreAutor;
    private String nombreUsuarioReseniado;
    private String fotoUsuarioAutor;
    private Double calificacion;
    private String textoResenia;

}
