package com.example.usuarioApi.Repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.usuarioApi.Model.Chat;

@Repository
public interface ChatRepository extends JpaRepository<Chat, Integer> {


}
