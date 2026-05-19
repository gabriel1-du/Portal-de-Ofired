package com.example.usuarioApi.Controller;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.example.usuarioApi.DTO.ClasesConfirmacionTransaccionDTO.ActualizarConfirmacionTransaccionDTO;
import com.example.usuarioApi.DTO.ClasesConfirmacionTransaccionDTO.CrearConfirmacionTransaccionDTO;
import com.example.usuarioApi.DTO.ClasesConfirmacionTransaccionDTO.LeerConfirmacionTransaccionDTO;
import com.example.usuarioApi.DTO.ClasesConfirmacionTransaccionDTO.LeerConfirmacionTransaccionFrontDTO;
import com.example.usuarioApi.Service.ConfirmacionTransaccionService;

@RestController
@RequestMapping("/api/confirmacion-transaccionApi")
public class ConfirmacionTransaccionController {

    @Autowired
    private ConfirmacionTransaccionService service;

    @PostMapping("/crear")
    public ResponseEntity<LeerConfirmacionTransaccionFrontDTO> crearTransaccion(@RequestBody CrearConfirmacionTransaccionDTO dto) {
        return new ResponseEntity<>(service.crearTransaccion(dto), HttpStatus.CREATED);
    }

    @GetMapping("/leer/{id}")
    public ResponseEntity<LeerConfirmacionTransaccionFrontDTO> leerPorId(@PathVariable Integer id) {
        return new ResponseEntity<>(service.leerTransaccionPorId(id), HttpStatus.OK);
    }

    @GetMapping("/leer-todos-front")
    public ResponseEntity<List<LeerConfirmacionTransaccionFrontDTO>> leerTodosFront() {
        return new ResponseEntity<>(service.leerTodasLasTransaccionesFront(), HttpStatus.OK);
    }

    @GetMapping("/leer-todos-id")
    public ResponseEntity<List<LeerConfirmacionTransaccionDTO>> leerTodosId() {
        return new ResponseEntity<>(service.leerTodasLasTransaccionesId(), HttpStatus.OK);
    }

    @PutMapping("/actualizar-estado/{id}")
    public ResponseEntity<LeerConfirmacionTransaccionFrontDTO> actualizarEstado(@PathVariable Integer id, @RequestBody ActualizarConfirmacionTransaccionDTO dto) {
        return new ResponseEntity<>(service.actualizarEstado(id, dto), HttpStatus.OK);
    }

    @DeleteMapping("/eliminar/{id}")
    public ResponseEntity<Void> eliminarTransaccion(@PathVariable Integer id) {
        service.eliminarTransaccion(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

    @GetMapping("/usuario/{idUsuario}")
    public ResponseEntity<List<LeerConfirmacionTransaccionFrontDTO>> buscarPorUsuario(@PathVariable Integer idUsuario) {
        return new ResponseEntity<>(service.buscarPorUsuarioInvolucrado(idUsuario), HttpStatus.OK);
    }
}