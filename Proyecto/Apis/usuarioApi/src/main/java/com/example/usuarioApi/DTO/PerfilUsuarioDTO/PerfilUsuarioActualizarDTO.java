package com.example.usuarioApi.DTO.PerfilUsuarioDTO;

import java.math.BigDecimal;

import lombok.Data;

@Data
public class PerfilUsuarioActualizarDTO {
    
    private String nombreApodo;
    private String fotografiaBanner;
    private String descripcion;
    private BigDecimal calificacion;

}
