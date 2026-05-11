package com.example.usuarioApi.ServiceImpl;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.usuarioApi.DTO.ClasesChatDTO.crearChatDTO;
import com.example.usuarioApi.DTO.ClasesChatDTO.leerFrontChatDTO;
import com.example.usuarioApi.DTO.ClasesChatDTO.LeerChatIDDTO;
import com.example.usuarioApi.DTO.ClasesChatDTO.mapperChatDTO;
import com.example.usuarioApi.Model.Chat;
import com.example.usuarioApi.Model.Usuario;
import com.example.usuarioApi.Repository.ChatRepository;
import com.example.usuarioApi.Repository.UsuarioRepository;
import com.example.usuarioApi.Service.ChatService;

@Service
public class ChatServiceImpl implements ChatService {

    @Autowired
    private ChatRepository chatRepository;

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private mapperChatDTO chatMapper;

    @Override
    @Transactional
    public leerFrontChatDTO crearChat(crearChatDTO dto) {
        // 1. Buscamos a los usuarios en la base de datos
        Usuario usuarioUno = usuarioRepository.findById(dto.getIdUsuario_uno())
                .orElseThrow(() -> new RuntimeException("El usuario iniciador (Usuario 1) no fue encontrado."));

        Usuario usuarioDos = usuarioRepository.findById(dto.getIdUsuario_dos())
                .orElseThrow(() -> new RuntimeException("El usuario destino (Usuario 2) no fue encontrado."));

        // 2. Usamos el mapper para instanciar el Chat y relacionarlo con ambos participantes
        Chat nuevoChat = chatMapper.mapToEntityCrear(usuarioUno, usuarioDos);

        // 3. Guardamos el Chat (sus participantes se guardan automáticamente por el CascadeType.ALL)
        Chat chatGuardado = chatRepository.save(nuevoChat);

        // 4. Transformamos a DTO para responder al cliente con la información recién generada
        return chatMapper.mapToLeerFrontDTO(chatGuardado);
    }

    @Override
    @Transactional(readOnly = true)
    public leerFrontChatDTO leerChatPorId(Integer idChat) {
        Chat chat = chatRepository.findById(idChat)
                .orElseThrow(() -> new RuntimeException("Chat no encontrado con el ID: " + idChat));
        return chatMapper.mapToLeerFrontDTO(chat);
    }

    @Override
    @Transactional(readOnly = true)
    public List<LeerChatIDDTO> leerTodosLosChatsId() {
        return chatRepository.findAll().stream()
                .map(chatMapper::mapToLeerIDDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<leerFrontChatDTO> leerTodosLosChatsFront() {
        return chatRepository.findAll().stream()
                .map(chatMapper::mapToLeerFrontDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public void eliminarChat(Integer idChat) {
        if (!chatRepository.existsById(idChat)) {
            throw new RuntimeException("No se puede eliminar: El chat con ID " + idChat + " no existe.");
        }
        chatRepository.deleteById(idChat);
    }
}
