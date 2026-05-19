package com.example.usuarioApi.DTO.ClasesParticicipantesChatDTO;

import org.springframework.stereotype.Component;

import com.example.usuarioApi.Model.Chat;
import com.example.usuarioApi.Model.ParticipanteChat;
import com.example.usuarioApi.Model.Usuario;

@Component
public class ParticipanteChatMapper {

    // --- MAP TO LEER FRONT DTO ---
    public LeerParticipanteChatFrontDTO mapToLeerFrontDTO(ParticipanteChat entidad) {
        if (entidad == null) return null;

        LeerParticipanteChatFrontDTO dto = new LeerParticipanteChatFrontDTO();
        
        dto.setIdParticipantesChat(entidad.getIdParticipantesChat());
        
        if (entidad.getChat() != null) {
            dto.setIdChat(entidad.getChat().getIdChat());
        }

        if (entidad.getUsuario() != null) {
            dto.setIdUsuario(entidad.getUsuario().getIdUsuario());
            dto.setNombreUsuario(entidad.getUsuario().getPNombre() + " " + entidad.getUsuario().getPApellido());
            dto.setFotoUsuario(entidad.getUsuario().getFoto());
        }

        return dto;
    }

    // --- MAP TO LEER ID DTO ---
    public LeerParticipanteChatIdDTO mapToLeerIdDTO(ParticipanteChat entidad) {
        if (entidad == null) return null;

        LeerParticipanteChatIdDTO dto = new LeerParticipanteChatIdDTO();
        dto.setIdParticipantesChat(entidad.getIdParticipantesChat());
        
        if (entidad.getChat() != null) dto.setIdChat(entidad.getChat().getIdChat());
        if (entidad.getUsuario() != null) dto.setIdUsuario(entidad.getUsuario().getIdUsuario());

        return dto;
    }

    // --- MAP TO ENTITY CREAR ---
    public ParticipanteChat mapToEntityCrear(Usuario usuario, Chat chat) {
        ParticipanteChat participante = new ParticipanteChat();
        participante.setUsuario(usuario);
        participante.setChat(chat);
        return participante;
    }
}
