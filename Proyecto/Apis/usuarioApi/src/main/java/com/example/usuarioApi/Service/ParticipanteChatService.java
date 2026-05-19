package com.example.usuarioApi.Service;

import java.util.List;

import com.example.usuarioApi.DTO.ClasesParticicipantesChatDTO.CrearParticipanteChatDTO;
import com.example.usuarioApi.DTO.ClasesParticicipantesChatDTO.LeerParticipanteChatFrontDTO;
import com.example.usuarioApi.DTO.ClasesParticicipantesChatDTO.LeerParticipanteChatIdDTO;

public interface ParticipanteChatService {

    LeerParticipanteChatFrontDTO crearParticipante(CrearParticipanteChatDTO dto);

    LeerParticipanteChatIdDTO leerParticipantePorId(Integer idParticipante);

    LeerParticipanteChatFrontDTO leerParticipanteFrontPorId(Integer idParticipante);

    List<LeerParticipanteChatIdDTO> leerTodosLosParticipantesId();

    List<LeerParticipanteChatFrontDTO> leerTodosLosParticipantesFront();

    void eliminarParticipante(Integer idParticipante);

}
