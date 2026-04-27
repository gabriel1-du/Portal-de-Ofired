package com.example.usuarioApi.DTO.PerfilUsuarioDTO;

import java.math.BigDecimal;
import java.sql.Timestamp;

import lombok.Data;

@Data
public class PerfilUsuarioDTO {

    private Integer idPerfilUsuario;
    private Integer idUsuario;
    private String correoElec; // Extraído de la entidad Usuario
    private String nombreApodo;
    private String primerNombre;
    private String segundoNombre;
    private String primerApellido;
    private String segundoApellido;
    private String numeroTelef;
    private String foto;
    private String fotografiaBanner;
    private Integer idRegionUsu;
    private Integer idComunaUsu;
    private Integer idOficio;
    private BigDecimal calificacion;
    private Integer idSexoUsu;
    private Timestamp fechaCreacion;

}
