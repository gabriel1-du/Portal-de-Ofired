package com.example.publicacionesApi.RestClientDTO;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UsuarioExternoDTO {

     private Integer idUsuario;
    private String primerNombre;
    private String segundoNombre;
    private String primerApellido;
    private String segundoApellido;
    
    private String correoElec;
    private String rut;
    private String rutDv;
    private String numeroTelef;
    private String foto;
    private java.math.BigDecimal valoracion; 
    
    // Fíjate que devolvemos Strings para que la interfaz sea fácil de armar
    private String nombreSexo;
    private String nombreTipoUsu;
    private String nombreRegion;
    private String nombreComuna;
    private String nombreOficio; 
    
    private java.sql.Timestamp fechaCreacion;

   
}
