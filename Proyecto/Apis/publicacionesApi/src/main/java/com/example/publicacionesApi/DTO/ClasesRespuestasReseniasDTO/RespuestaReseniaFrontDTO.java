package com.example.publicacionesApi.DTO.ClasesRespuestasReseniasDTO;

import lombok.Data;

@Data
public class RespuestaReseniaFrontDTO {

    private Integer idRespuestaResenia;
    private Integer idResenia;
    private String nombreDelAutor;
    private String fotoAutor;
    private String textoRespuestaResenia;

}
