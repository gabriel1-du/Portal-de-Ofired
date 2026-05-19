package com.example.usuarioApi.DTO.ClasesChatDTO;

import java.time.LocalDateTime;

import lombok.Data;

@Data
public class leerFrontChatDTO {

    // Datos de la sala
    private Integer idChat;
    private LocalDateTime fechaCreacion;

    // Datos del Participante 1
    private Integer idUsuario1;
    private String nombreUsuario1;
    private String fotoUsuario1;

    // Datos del Participante 2
    private Integer idUsuario2;
    private String nombreUsuario2;
    private String fotoUsuario2;

}
