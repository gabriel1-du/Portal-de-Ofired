package com.example.usuarioApi.ServiceImpl;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.usuarioApi.DTO.ClasesMensajesChatDTO.CrearMensajeChatDTO;
import com.example.usuarioApi.DTO.ClasesMensajesChatDTO.LeerMensajeChatFrontDTO;
import com.example.usuarioApi.DTO.ClasesMensajesChatDTO.LeerMensajeChatIdDTO;
import com.example.usuarioApi.DTO.ClasesMensajesChatDTO.MensajeChatMapper;
import com.example.usuarioApi.Model.Chat;
import com.example.usuarioApi.Model.MensajeChat;
import com.example.usuarioApi.Model.Usuario;
import com.example.usuarioApi.Repository.ChatRepository;
import com.example.usuarioApi.Repository.MensajeChatRepository;
import com.example.usuarioApi.Repository.UsuarioRepository;
import com.example.usuarioApi.Service.MensajeChatService;

@Service
public class MensajeChatServiceImpl implements MensajeChatService {

    @Autowired
    private MensajeChatRepository mensajeChatRepository;

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private ChatRepository chatRepository;

    @Autowired
    private MensajeChatMapper mensajeChatMapper;

    @Override
    @Transactional
    public LeerMensajeChatFrontDTO crearMensaje(CrearMensajeChatDTO dto) {
        Usuario autor = usuarioRepository.findById(dto.getIdAutor())
                .orElseThrow(() -> new RuntimeException("No se encontró el autor con ID: " + dto.getIdAutor()));
                
        Chat chat = chatRepository.findById(dto.getIdChat())
                .orElseThrow(() -> new RuntimeException("No se encontró el chat con ID: " + dto.getIdChat()));

        MensajeChat nuevoMensaje = mensajeChatMapper.mapToEntityCrear(dto, autor, chat);
        MensajeChat guardado = mensajeChatRepository.save(nuevoMensaje);
        
        return mensajeChatMapper.mapToLeerFrontDTO(guardado);
    }

    @Override
    @Transactional(readOnly = true)
    public LeerMensajeChatIdDTO leerMensajePorId(Integer id) {
        return mensajeChatRepository.findById(id)
                .map(mensajeChatMapper::mapToLeerIdDTO)
                .orElseThrow(() -> new RuntimeException("Mensaje no encontrado con ID: " + id));
    }

    @Override
    @Transactional(readOnly = true)
    public LeerMensajeChatFrontDTO leerMensajeFrontPorId(Integer id) {
        return mensajeChatRepository.findById(id)
                .map(mensajeChatMapper::mapToLeerFrontDTO)
                .orElseThrow(() -> new RuntimeException("Mensaje no encontrado con ID: " + id));
    }

    @Override
    @Transactional(readOnly = true)
    public List<LeerMensajeChatFrontDTO> leerMensajesPorChat(Integer idChat) {
        return mensajeChatRepository.findByChat_IdChatOrderByFechaHoraEnvioAsc(idChat).stream()
                .map(mensajeChatMapper::mapToLeerFrontDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public void eliminarMensaje(Integer id) {
        if (!mensajeChatRepository.existsById(id)) {
            throw new RuntimeException("No se puede eliminar: El mensaje no existe.");
        }
        mensajeChatRepository.deleteById(id);
    }
}
