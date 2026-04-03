package com.example.usuarioApi.Repository;

import com.example.usuarioApi.Model.ParticipantesChat;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ParticipantesChatRepository extends JpaRepository<ParticipantesChat, Integer> {
}