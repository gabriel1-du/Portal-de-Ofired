package com.example.usuarioApi.DTO.ClasesDenunciaDTO;

import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Data
@NoArgsConstructor
@Getter
@Setter
public class CrearDenunciaDTO {
    
    private Integer idUsuarioDenunciante;
    private Integer idUsuarioDenunciado; 
    private Integer idTipoDenuncia;      
    private String descripcionDenuncia;  
    private Integer idTipoContenido;
}