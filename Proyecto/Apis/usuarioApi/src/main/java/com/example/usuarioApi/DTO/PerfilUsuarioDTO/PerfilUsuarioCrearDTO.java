package com.example.usuarioApi.DTO.PerfilUsuarioDTO;

import lombok.Data;

@Data
public class PerfilUsuarioCrearDTO {
    
    // Solo necesitamos el ID para buscar toda la info en la BD
    private Integer idUsuario;
    
    // Y los datos que son 100% exclusivos del perfil
    private String nombreApodo;
    private String fotografiaBanner;

}
