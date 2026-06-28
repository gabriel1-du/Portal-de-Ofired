package com.example.usuarioApi.DTO.clasesUsuarioDTO;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.sql.Timestamp;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class leerUsuarioDTOAdmin {

    // Datos principales del usuario
    private Integer idUsuario;
    private String primerNombre;
    private String segundoNombre;
    private String primerApellido;
    private String segundoApellido;

    // Credenciales e identificación
    private String correoElec;
    private String rut;
    private String rutDv;

    // Contacto y perfil
    private String numeroTelef;
    private String foto;
    private BigDecimal valoracion;
    private Timestamp fechaCreacion;

    // IDs de relaciones (útil para un admin)
    private Integer idSexo;
    private Integer idTipoUsu;
    private Integer idRegion;
    private Integer idComuna;
    private Integer idOficio;

    // Nombres de relaciones (para visualización)
    private String nombreSexo;
    private String nombreTipoUsu;
    private String nombreRegion;
    private String nombreComuna;
    private String nombreOficio;
}