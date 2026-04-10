package com.example.usuarioApi.DTO.clasesUsuarioDTO;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class crearUsuarioLVL2DTO {

    // Datos personales
    private String primerNombre;
    private String segundoNombre;
    private String primerApellido;
    private String segundoApellido;
    private Integer idSexoUsu;
    
    // Credenciales
    private String correoElec;
    private String password;
    
    // Identificación y Contacto
    private String rut;
    private String rutDv;
    private String numeroTelef;
    
    // Configuración de la cuenta
    private Integer idTipoUsu; 
    private String foto;
    private Double valoracion; 

    // Ubicación y Especialidad (Opcionales dependiendo del tipo de usuario)
    private Integer idRegionUsu;
    private Integer idComunaUsu;
    private Integer idOficio;



}
