package com.example.usuarioApi.DTO.ClasesUsuariosBloqueadosDTO;

import java.time.LocalDateTime;

import lombok.Data;

@Data
public class LeerUsuariosBloqueadosIdDTO {

    private Integer idBloqueo;
    private Boolean habilitador;
    private LocalDateTime fechaRegistro;
    private Integer idUsuarioQueBloquea;
    private Integer idUsuarioBloqueado;

}
