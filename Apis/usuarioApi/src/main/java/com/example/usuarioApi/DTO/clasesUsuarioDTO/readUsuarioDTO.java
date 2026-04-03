package com.example.usuarioApi.DTO.clasesUsuarioDTO;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class readUsuarioDTO {

    private Integer idUsuario;
    private String pNombre;
    private String sNombre;
    private String pApellido;
    private String sApellido;
    
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
