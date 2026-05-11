package com.example.usuarioApi.Controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.example.usuarioApi.DTO.ClasesParticicipantesChatDTO.CrearParticipanteChatDTO;
import com.example.usuarioApi.DTO.ClasesParticicipantesChatDTO.LeerParticipanteChatFrontDTO;
import com.example.usuarioApi.DTO.ClasesParticicipantesChatDTO.LeerParticipanteChatIdDTO;
import com.example.usuarioApi.Service.ParticipanteChatService;

@RestController
@RequestMapping("/api/participantes-chat")
@CrossOrigin(origins = "*") // Permite peticiones desde el frontend
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

    @DeleteMapping("/eliminar/{id}")
    public ResponseEntity<Void> eliminarParticipante(@PathVariable Integer id) {
        participanteChatService.eliminarParticipante(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }
}
