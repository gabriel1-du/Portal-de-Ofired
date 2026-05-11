package com.example.usuarioApi.DTO.ClasesMensajesChatDTO;

import java.time.LocalDateTime;

import lombok.Data;

@Data
public class LeerMensajeChatFrontDTO {

    private Integer idMensajeChat;
    private String mensajeTexto;
    private LocalDateTime fechaHoraEnvio;
    private Integer idChat;
    
    private Integer idAutor;
    private String nombreAutor; // Primer Nombre + Primer Apellido
    private String fotoAutor;
}
