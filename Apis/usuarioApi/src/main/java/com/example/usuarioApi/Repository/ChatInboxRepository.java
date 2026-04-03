package com.example.usuarioApi.Repository;

import com.example.usuarioApi.Model.ChatInbox;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ChatInboxRepository extends JpaRepository<ChatInbox, Integer> {
}