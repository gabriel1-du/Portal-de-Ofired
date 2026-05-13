package com.example.usuarioApi.Service;

import java.util.List;

import com.example.usuarioApi.DTO.ClasesChatDTO.crearChatDTO;
import com.example.usuarioApi.DTO.ClasesChatDTO.leerFrontChatDTO;
import com.example.usuarioApi.DTO.ClasesChatDTO.LeerChatIDDTO;

public interface ChatService {

    leerFrontChatDTO crearChat(crearChatDTO dto);

    leerFrontChatDTO leerChatPorId(Integer idChat);

    List<LeerChatIDDTO> leerTodosLosChatsId();

    List<leerFrontChatDTO> leerTodosLosChatsFront();

    List<leerFrontChatDTO> buscarChatsPorIdUsuario(Integer idUsuario);

    void eliminarChat(Integer idChat);

}
