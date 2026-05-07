package com.example.publicacionesApi.DTO.ClasesRespuestasReseniasDTO;

import lombok.Data;

@Data
public class RespuestaReseniaFrontDTO {

    private Integer idRespuestaResenia;
    private Integer idResenia;
    private Integer nombreDelAutor;
    private String textoRespuestaResenia;

}
