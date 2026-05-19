package com.example.usuarioApi.Service;

import java.util.List;

import com.example.usuarioApi.DTO.ClasesMensajesChatDTO.CrearMensajeChatDTO;
import com.example.usuarioApi.DTO.ClasesMensajesChatDTO.LeerMensajeChatFrontDTO;
import com.example.usuarioApi.DTO.ClasesMensajesChatDTO.LeerMensajeChatIdDTO;

public interface MensajeChatService {

    LeerMensajeChatFrontDTO crearMensaje(CrearMensajeChatDTO dto);

    LeerMensajeChatIdDTO leerMensajePorId(Integer idMensaje);

    LeerMensajeChatFrontDTO leerMensajeFrontPorId(Integer idMensaje);

    List<LeerMensajeChatFrontDTO> leerMensajesPorChat(Integer idChat);

    void eliminarMensaje(Integer idMensaje);

}
