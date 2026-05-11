package com.example.usuarioApi.Controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.example.usuarioApi.DTO.ClasesParticicipantesChatDTO.CrearParticipanteChatDTO;
import com.example.usuarioApi.DTO.ClasesParticicipantesChatDTO.LeerParticipanteChatFrontDTO;
import com.example.usuarioApi.DTO.ClasesParticicipantesChatDTO.LeerParticipanteChatIdDTO;
import com.example.usuarioApi.Service.ParticipanteChatService;

@RestController
@RequestMapping("/api/participantes-chatApi")
public class ParticipanteChatController {

    @Autowired
    private ParticipanteChatService participanteChatService;

    @PostMapping("/crear")
    public ResponseEntity<LeerParticipanteChatFrontDTO> crearParticipante(@RequestBody CrearParticipanteChatDTO dto) {
        LeerParticipanteChatFrontDTO nuevoParticipante = participanteChatService.crearParticipante(dto);
        return new ResponseEntity<>(nuevoParticipante, HttpStatus.CREATED);
    }

    @GetMapping("/leer-id/{id}")
    public ResponseEntity<LeerParticipanteChatIdDTO> leerParticipantePorId(@PathVariable Integer id) {
        LeerParticipanteChatIdDTO participante = participanteChatService.leerParticipantePorId(id);
        return new ResponseEntity<>(participante, HttpStatus.OK);
    }

    @GetMapping("/leer-front/{id}")
    public ResponseEntity<LeerParticipanteChatFrontDTO> leerParticipanteFrontPorId(@PathVariable Integer id) {
        LeerParticipanteChatFrontDTO participante = participanteChatService.leerParticipanteFrontPorId(id);
        return new ResponseEntity<>(participante, HttpStatus.OK);
    }

    @GetMapping
    public ResponseEntity<List<LeerParticipanteChatIdDTO>> leerTodosLosParticipantesId() {
        List<LeerParticipanteChatIdDTO> participantes = participanteChatService.leerTodosLosParticipantesId();
        return new ResponseEntity<>(participantes, HttpStatus.OK);
    }

    @GetMapping("/leer-todos")
    public ResponseEntity<List<LeerParticipanteChatFrontDTO>> leerTodosLosParticipantesFront() {
        List<LeerParticipanteChatFrontDTO> participantes = participanteChatService.leerTodosLosParticipantesFront();
        return new ResponseEntity<>(participantes, HttpStatus.OK);
    }

    @DeleteMapping("/eliminar/{id}")
    public ResponseEntity<Void> eliminarParticipante(@PathVariable Integer id) {
        participanteChatService.eliminarParticipante(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }
}
