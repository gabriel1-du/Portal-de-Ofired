package com.example.usuarioApi.Service;

import com.example.usuarioApi.DTO.ClasesChatDTO.crearChatDTO;
import com.example.usuarioApi.DTO.ClasesChatDTO.leerFrontChatDTO;

public interface ChatService {

    leerFrontChatDTO crearChat(crearChatDTO dto);

    leerFrontChatDTO leerChatPorId(Integer idChat);

    void eliminarChat(Integer idChat);

}
