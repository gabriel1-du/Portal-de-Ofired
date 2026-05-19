package com.example.usuarioApi.DTO.ClasesParticicipantesChatDTO;

import lombok.Data;

@Data
public class LeerParticipanteChatFrontDTO {

    private Integer idParticipantesChat;
    private Integer idChat;
    private Integer idUsuario;
    private String nombreUsuario; // Primer Nombre + Primer Apellido
    private String fotoUsuario;

}
