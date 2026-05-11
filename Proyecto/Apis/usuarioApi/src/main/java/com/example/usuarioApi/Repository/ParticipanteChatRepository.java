package com.example.usuarioApi.Repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.usuarioApi.Model.ParticipanteChat;

@Repository
public interface ParticipanteChatRepository extends JpaRepository<ParticipanteChat, Integer> {

}
