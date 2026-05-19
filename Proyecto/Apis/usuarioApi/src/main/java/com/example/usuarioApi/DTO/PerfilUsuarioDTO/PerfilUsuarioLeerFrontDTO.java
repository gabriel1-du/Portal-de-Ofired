package com.example.usuarioApi.DTO.PerfilUsuarioDTO;

import java.math.BigDecimal;
import java.sql.Timestamp;

import lombok.Data;

@Data
public class PerfilUsuarioLeerFrontDTO {

    private Integer idPerfilUsuario;
    private Integer idUsuario;
    private String correoElec;
    
    // Nombres completos y datos del perfil
    private String nombreApodo;
    private String primerNombre;
    private String segundoNombre;
    private String primerApellido;
    private String segundoApellido;
    private String numeroTelef;
    private String foto;
    private String fotografiaBanner;
    private String descripcion;
    
    // AQUÍ ESTÁ LA MAGIA: Enviamos textos, no IDs
    private String nombreRegion;
    private String nombreComuna;
    private String nombreOficio;
    private String nombreSexo; 
    
    private BigDecimal calificacion;
    private Timestamp fechaCreacion;

}
