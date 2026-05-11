package com.example.usuarioApi.DTO.ClasesMensajesChatDTO;

import lombok.Data;

@Data
public class CrearMensajeChatDTO {

    private String mensajeTexto;
    private Integer idChat;
    private Integer idAutor;

}
