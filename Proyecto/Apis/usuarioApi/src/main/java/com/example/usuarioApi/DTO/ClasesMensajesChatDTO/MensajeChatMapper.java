package com.example.usuarioApi.DTO.ClasesMensajesChatDTO;

import org.springframework.stereotype.Component;

import com.example.usuarioApi.Model.Chat;
import com.example.usuarioApi.Model.MensajeChat;
import com.example.usuarioApi.Model.Usuario;

@Component
public class MensajeChatMapper {

    // --- MAP TO LEER FRONT DTO ---
    public LeerMensajeChatFrontDTO mapToLeerFrontDTO(MensajeChat entidad) {
        if (entidad == null) return null;

        LeerMensajeChatFrontDTO dto = new LeerMensajeChatFrontDTO();
        
        dto.setIdMensajeChat(entidad.getIdMensajeChat());
        dto.setMensajeTexto(entidad.getMensajeTexto());
        dto.setFechaHoraEnvio(entidad.getFechaHoraEnvio());
        
        if (entidad.getChat() != null) {
            dto.setIdChat(entidad.getChat().getIdChat());
        }

        if (entidad.getAutor() != null) {
            dto.setIdAutor(entidad.getAutor().getIdUsuario());
            dto.setNombreAutor(entidad.getAutor().getPNombre() + " " + entidad.getAutor().getPApellido());
            dto.setFotoAutor(entidad.getAutor().getFoto());
        }

        return dto;
    }

    // --- MAP TO LEER ID DTO ---
    public LeerMensajeChatIdDTO mapToLeerIdDTO(MensajeChat entidad) {
        if (entidad == null) return null;

        LeerMensajeChatIdDTO dto = new LeerMensajeChatIdDTO();
        dto.setIdMensajeChat(entidad.getIdMensajeChat());
        dto.setMensajeTexto(entidad.getMensajeTexto());
        dto.setFechaHoraEnvio(entidad.getFechaHoraEnvio());
        
        if (entidad.getChat() != null) dto.setIdChat(entidad.getChat().getIdChat());
        if (entidad.getAutor() != null) dto.setIdAutor(entidad.getAutor().getIdUsuario());

        return dto;
    }

    // --- MAP TO ENTITY CREAR ---
    public MensajeChat mapToEntityCrear(CrearMensajeChatDTO dto, Usuario autor, Chat chat) {
        MensajeChat mensaje = new MensajeChat();
        mensaje.setMensajeTexto(dto.getMensajeTexto());
        mensaje.setAutor(autor);
        mensaje.setChat(chat);
        return mensaje;
    }
}