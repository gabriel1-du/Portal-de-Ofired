package com.example.usuarioApi.Controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.example.usuarioApi.DTO.ClasesMensajesChatDTO.CrearMensajeChatDTO;
import com.example.usuarioApi.DTO.ClasesMensajesChatDTO.LeerMensajeChatFrontDTO;
import com.example.usuarioApi.DTO.ClasesMensajesChatDTO.LeerMensajeChatIdDTO;
import com.example.usuarioApi.Service.MensajeChatService;

@RestController
@RequestMapping("/api/mensajes-chat")
@CrossOrigin(origins = "*") // Permite peticiones desde React o tu aplicación Front-end
public class MensajeChatController {

    @Autowired
    private MensajeChatService mensajeChatService;

    @PostMapping("/crear")
    public ResponseEntity<LeerMensajeChatFrontDTO> crearMensaje(@RequestBody CrearMensajeChatDTO dto) {
        LeerMensajeChatFrontDTO nuevoMensaje = mensajeChatService.crearMensaje(dto);
        return new ResponseEntity<>(nuevoMensaje, HttpStatus.CREATED);
    }

    @GetMapping("/leer-id/{id}")
    public ResponseEntity<LeerMensajeChatIdDTO> leerMensajePorId(@PathVariable Integer id) {
        LeerMensajeChatIdDTO mensaje = mensajeChatService.leerMensajePorId(id);
        return new ResponseEntity<>(mensaje, HttpStatus.OK);
    }

    @GetMapping("/leer-front/{id}")
    public ResponseEntity<LeerMensajeChatFrontDTO> leerMensajeFrontPorId(@PathVariable Integer id) {
        LeerMensajeChatFrontDTO mensaje = mensajeChatService.leerMensajeFrontPorId(id);
        return new ResponseEntity<>(mensaje, HttpStatus.OK);
    }

    @GetMapping("/chat/{idChat}")
    public ResponseEntity<List<LeerMensajeChatFrontDTO>> leerMensajesPorChat(@PathVariable Integer idChat) {
        List<LeerMensajeChatFrontDTO> mensajes = mensajeChatService.leerMensajesPorChat(idChat);
        return new ResponseEntity<>(mensajes, HttpStatus.OK);
    }

    @DeleteMapping("/eliminar/{id}")
    public ResponseEntity<Void> eliminarMensaje(@PathVariable Integer id) {
        mensajeChatService.eliminarMensaje(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }
}