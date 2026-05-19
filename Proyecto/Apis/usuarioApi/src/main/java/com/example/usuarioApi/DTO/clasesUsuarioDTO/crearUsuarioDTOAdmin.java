package com.example.usuarioApi.DTO.clasesUsuarioDTO;

import lombok.Data;

@Data
public class crearUsuarioDTOAdmin {
    private String primerNombre;
    private String segundoNombre;
    private String primerApellido;
    private String segundoApellido;
    private String correoElec;
    private String password;
    private String rut;
    private String rutDv;
    private String numeroTelef;
    private String foto;
    private Double valoracion;
    private Boolean habilitadorAdministrador;
    private Integer idSexoUsu;
    private Integer idTipoUsu;
    private Integer idRegionUsu;
    private Integer idComunaUsu;
    private Integer idOficio;
}
