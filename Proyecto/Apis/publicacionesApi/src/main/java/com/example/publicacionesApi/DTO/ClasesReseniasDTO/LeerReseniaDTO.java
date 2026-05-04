package com.example.publicacionesApi.DTO.ClasesReseniasDTO;

import lombok.Data;

@Data
public class LeerReseniaDTO {

   
    private Integer idResenia;
    private Integer idAutor;
    private Integer idUsuarioReseniado;
    private Double calificacion;
    private String textoResenia;


    
}
