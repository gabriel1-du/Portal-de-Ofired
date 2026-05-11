package com.example.usuarioApi.DTO.ClasesChatDTO;

import lombok.Data;

@Data
public class crearChatDTO {

    // El ID del cliente que está iniciando la conversación
    private Integer idUsuario_uno;
    
    // El ID del gasfíter con el que se quiere contactar
    private Integer idUsuario_dos;

}
