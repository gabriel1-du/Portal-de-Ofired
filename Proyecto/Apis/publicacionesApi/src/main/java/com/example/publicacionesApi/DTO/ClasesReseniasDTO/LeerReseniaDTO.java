package com.example.publicacionesApi.DTO.ClasesReseniasDTO;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class LeerReseniaDTO {

   
    private Integer idResenia;
    private Integer idAutor;
    private Integer idUsuarioReseniado;
    private Double calificacion;
    private String textoResenia;
    private LocalDateTime fechaCreacion;

    
}
