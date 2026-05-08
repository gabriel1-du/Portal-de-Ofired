package com.example.publicacionesApi.DTO.ClasesRespuestasReseniasDTO;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class RespuestaReseniaDTO {
    private Integer idRespuestaResenia;
    private Integer idResenia;
    private Integer idAutorRes;
    private String textoRespuestaResenia;
    private LocalDateTime fechaCreacion;
}
