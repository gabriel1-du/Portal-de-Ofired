package com.example.usuarioApi.ServiceImpl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.usuarioApi.DTO.ClasesParticicipantesChatDTO.CrearParticipanteChatDTO;
import com.example.usuarioApi.DTO.ClasesParticicipantesChatDTO.LeerParticipanteChatFrontDTO;
import com.example.usuarioApi.DTO.ClasesParticicipantesChatDTO.LeerParticipanteChatIdDTO;
import com.example.usuarioApi.DTO.ClasesParticicipantesChatDTO.ParticipanteChatMapper;
import com.example.usuarioApi.Model.Chat;
import com.example.usuarioApi.Model.ParticipanteChat;
import com.example.usuarioApi.Model.Usuario;
import com.example.usuarioApi.Repository.ChatRepository;
import com.example.usuarioApi.Repository.ParticipanteChatRepository;
import com.example.usuarioApi.Repository.UsuarioRepository;
import com.example.usuarioApi.Service.ParticipanteChatService;

@Service
public class ParticipanteChatServiceImpl implements ParticipanteChatService {

    @Autowired
    private ParticipanteChatRepository participanteChatRepository;

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private ChatRepository chatRepository;

    @Autowired
    private ParticipanteChatMapper participanteChatMapper;

    @Override
    @Transactional
    public LeerParticipanteChatFrontDTO crearParticipante(CrearParticipanteChatDTO dto) {
        Usuario usuario = usuarioRepository.findById(dto.getIdUsuario())
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado con ID: " + dto.getIdUsuario()));
                
        Chat chat = chatRepository.findById(dto.getIdChat())
                .orElseThrow(() -> new RuntimeException("Chat no encontrado con ID: " + dto.getIdChat()));

        ParticipanteChat nuevoParticipante = participanteChatMapper.mapToEntityCrear(usuario, chat);
        ParticipanteChat guardado = participanteChatRepository.save(nuevoParticipante);
        
        return participanteChatMapper.mapToLeerFrontDTO(guardado);
    }

    @Override
    @Transactional(readOnly = true)
    public LeerParticipanteChatIdDTO leerParticipantePorId(Integer id) {
        ParticipanteChat participante = participanteChatRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Participante no encontrado con ID: " + id));
        return participanteChatMapper.mapToLeerIdDTO(participante);
    }

    @Override
    @Transactional(readOnly = true)
    public LeerParticipanteChatFrontDTO leerParticipanteFrontPorId(Integer id) {
        ParticipanteChat participante = participanteChatRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Participante no encontrado con ID: " + id));
        return participanteChatMapper.mapToLeerFrontDTO(participante);
    }

    @Override
    @Transactional
    public void eliminarParticipante(Integer id) {
        if (!participanteChatRepository.existsById(id)) {
            throw new RuntimeException("No se puede eliminar: El participante con ID " + id + " no existe.");
        }
        participanteChatRepository.deleteById(id);
    }
}
