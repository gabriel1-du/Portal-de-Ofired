package com.example.usuarioApi.DTO.ClasesDenunciaDTO;

import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class CrearDenunciaDTO {
    
    private Integer idUsuarioDenunciado; 
    private Integer idTipoDenuncia;      
    private String descripcionDenuncia;  
    
}