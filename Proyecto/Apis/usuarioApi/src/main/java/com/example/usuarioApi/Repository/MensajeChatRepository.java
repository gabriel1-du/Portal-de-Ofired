package com.example.usuarioApi.Repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.usuarioApi.Model.MensajeChat;

@Repository
public interface MensajeChatRepository extends JpaRepository<MensajeChat, Integer> {
    // Búsqueda personalizada: Obtiene todos los mensajes de un chat, ordenados cronológicamente
    List<MensajeChat> findByChat_IdChatOrderByFechaHoraEnvioAsc(Integer idChat);
}
