package com.example.usuarioApi.DTO.ClasesChatDTO;

import java.util.ArrayList;
import java.util.List;

import org.springframework.stereotype.Component;

import com.example.usuarioApi.Model.Chat;
import com.example.usuarioApi.Model.ParticipanteChat;
import com.example.usuarioApi.Model.Usuario;

@Component
public class mapperChatDTO {

    // --- MAP TO LEER FRONT DTO ---
    public leerFrontChatDTO mapToLeerFrontDTO(Chat chat) {
        if (chat == null) return null;

        leerFrontChatDTO dto = new leerFrontChatDTO();
        
        dto.setIdChat(chat.getIdChat());
        dto.setFechaCreacion(chat.getFechaCreacion());

        // Extraer los usuarios desde la lista de participantes de la entidad Chat
        List<ParticipanteChat> participantes = chat.getParticipantes();
        if (participantes != null) {
            if (participantes.size() > 0 && participantes.get(0).getUsuario() != null) {
                Usuario usuario1 = participantes.get(0).getUsuario();
                dto.setIdUsuario1(usuario1.getIdUsuario());
                // Concatenamos Primer Nombre y Primer Apellido
                dto.setNombreUsuario1(usuario1.getPNombre() + " " + usuario1.getPApellido());
                dto.setFotoUsuario1(usuario1.getFoto());
            }
            if (participantes.size() > 1 && participantes.get(1).getUsuario() != null) {
                Usuario usuario2 = participantes.get(1).getUsuario();
                dto.setIdUsuario2(usuario2.getIdUsuario());
                dto.setNombreUsuario2(usuario2.getPNombre() + " " + usuario2.getPApellido());
                dto.setFotoUsuario2(usuario2.getFoto());
            }
        }
        
        return dto;
    }

    // --- MAP TO LEER ID DTO ---
    public LeerChatIDDTO mapToLeerIDDTO(Chat chat) {
        if (chat == null) return null;

        LeerChatIDDTO dto = new LeerChatIDDTO();
        
        dto.setIdChat(chat.getIdChat());
        dto.setFechaCreacion(chat.getFechaCreacion());

        List<ParticipanteChat> participantes = chat.getParticipantes();
        if (participantes != null) {
            if (participantes.size() > 0 && participantes.get(0).getUsuario() != null) {
                Usuario usuario1 = participantes.get(0).getUsuario();
                dto.setIdUsuario1(usuario1.getIdUsuario());
                dto.setFotoUsuario1(usuario1.getFoto());
            }
            if (participantes.size() > 1 && participantes.get(1).getUsuario() != null) {
                Usuario usuario2 = participantes.get(1).getUsuario();
                dto.setIdUsuario2(usuario2.getIdUsuario());
                dto.setFotoUsuario2(usuario2.getFoto());
            }
        }

        return dto;
    }

    // --- MAP TO ENTITY CREAR ---
    // Como el DTO solo trae los IDs, este método recibe las entidades Usuario 
    // (previamente buscadas en el Service) y arma el Chat con sus Participantes.
    public Chat mapToEntityCrear(Usuario usuarioUno, Usuario usuarioDos) {
        Chat chat = new Chat();
        
        List<ParticipanteChat> participantes = new ArrayList<>();

        ParticipanteChat participante1 = new ParticipanteChat();
        participante1.setChat(chat);
        participante1.setUsuario(usuarioUno);
        participantes.add(participante1);

        ParticipanteChat participante2 = new ParticipanteChat();
        participante2.setChat(chat);
        participante2.setUsuario(usuarioDos);
        participantes.add(participante2);

        // Se asigna la misma sala de chat a ambos participantes automáticamente
        chat.setParticipantes(participantes);

        return chat;
    }
}
