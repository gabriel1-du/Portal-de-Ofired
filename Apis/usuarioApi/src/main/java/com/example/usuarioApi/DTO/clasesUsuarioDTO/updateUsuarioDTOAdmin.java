package com.example.usuarioApi.DTO.clasesUsuarioDTO;

import lombok.Data;

@Data
public class updateUsuarioDTOAdmin {


    // 1. Datos personales básicos
    private String pNombre;
    private String sNombre;
    private String pApellido;
    private String sApellido;
    private Integer idSexoUsu;
    
    // 2. Datos CRÍTICOS (Poder exclusivo del Admin)
    private String correoElec; // Por si el usuario se equivocó al registrarse y pide ayuda
    private String rut;
    private String rutDv;
    
    // 3. Permisos y Roles (Poder exclusivo del Admin)
    private Integer idTipoUsu; // Permite ascender a un Cliente a Profesional, por ejemplo
    private Boolean habilitadorAdministrador; // Convertir a otro usuario en Admin
  
    
    // 4. Contacto y Ubicación
    private String numeroTelef;
    private Integer idRegionUsu;
    private Integer idComunaUsu;
    private Integer idOficio;
    

}
