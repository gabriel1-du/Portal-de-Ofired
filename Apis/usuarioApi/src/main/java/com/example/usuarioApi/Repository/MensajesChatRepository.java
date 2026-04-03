package com.example.usuarioApi.Repository;

import com.example.usuarioApi.Model.MensajesChat;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface MensajesChatRepository extends JpaRepository<MensajesChat, Integer> {
}