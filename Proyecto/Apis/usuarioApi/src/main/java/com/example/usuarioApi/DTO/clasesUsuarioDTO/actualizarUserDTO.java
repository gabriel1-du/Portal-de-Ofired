package com.example.usuarioApi.DTO.clasesUsuarioDTO;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor

//Este DTO lo usa el usuario para editar su eprgil
public class actualizarUserDTO {

    private String primerNombre;
    private String segundoNombre;
    private String primerApellido;
    private String segundoApellido;
    private String password;
    
    private Integer idSexoUsu;
    private String numeroTelef; 
    private String correoElec; 

    private Integer idRegionUsu;
    private Integer idComunaUsu;
    private Integer idOficio;

    private String foto;
}
