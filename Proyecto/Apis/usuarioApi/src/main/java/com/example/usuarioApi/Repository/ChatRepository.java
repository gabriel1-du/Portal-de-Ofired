package com.example.usuarioApi.Repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.example.usuarioApi.Model.Chat;

@Repository
public interface ChatRepository extends JpaRepository<Chat, Integer> {

    // Busca todos los chats en los que un usuario específico está participando
    @Query("SELECT c FROM Chat c JOIN c.participantes p WHERE p.usuario.idUsuario = :idUsuario")
    List<Chat> buscarChatsPorIdUsuario(@Param("idUsuario") Integer idUsuario);

}
