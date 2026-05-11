package com.example.usuarioApi.Controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.example.usuarioApi.DTO.ClasesChatDTO.crearChatDTO;
import com.example.usuarioApi.DTO.ClasesChatDTO.leerFrontChatDTO;
import com.example.usuarioApi.Service.ChatService;

@RestController
@RequestMapping("/api/chat")
public class ChatController {

    @Autowired
    private ChatService chatService;

    @PostMapping("/crear")
    public ResponseEntity<leerFrontChatDTO> crearChat(@RequestBody crearChatDTO dto) {
        leerFrontChatDTO nuevoChat = chatService.crearChat(dto);
        return new ResponseEntity<>(nuevoChat, HttpStatus.CREATED);
    }

    @GetMapping("/leer/{id}")
    public ResponseEntity<leerFrontChatDTO> leerChatPorId(@PathVariable Integer id) {
        leerFrontChatDTO chat = chatService.leerChatPorId(id);
        return new ResponseEntity<>(chat, HttpStatus.OK);
    }

    @DeleteMapping("/eliminar/{id}")
    public ResponseEntity<Void> eliminarChat(@PathVariable Integer id) {
        chatService.eliminarChat(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

}
