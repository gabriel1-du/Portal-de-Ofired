package com.example.usuarioApi.Controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.example.usuarioApi.DTO.ClasesUsuariosBloqueadosDTO.ActualizarUsuariosBloqueadosDTO;
import com.example.usuarioApi.DTO.ClasesUsuariosBloqueadosDTO.CrearUsuariosBloqueadosDTO;
import com.example.usuarioApi.DTO.ClasesUsuariosBloqueadosDTO.LeerUsuariosBloqueadosIdDTO;
import com.example.usuarioApi.Service.UsuariosBloqueadosService;

@RestController
@RequestMapping("/api/usuarios-bloqueadosApi")
public class UsuariosBloqueadosController {

    @Autowired
    private UsuariosBloqueadosService bloqueoService;

    @PostMapping("/crear")
    public ResponseEntity<LeerUsuariosBloqueadosIdDTO> crearBloqueo(@RequestBody CrearUsuariosBloqueadosDTO dto) {
        return new ResponseEntity<>(bloqueoService.crearBloqueo(dto), HttpStatus.CREATED);
    }

    @PutMapping("/actualizar/{id}")
    public ResponseEntity<LeerUsuariosBloqueadosIdDTO> actualizarBloqueo(@PathVariable Integer id, @RequestBody ActualizarUsuariosBloqueadosDTO dto) {
        return new ResponseEntity<>(bloqueoService.actualizarBloqueo(id, dto), HttpStatus.OK);
    }

    @DeleteMapping("/eliminar/{id}")
    public ResponseEntity<Void> eliminarBloqueo(@PathVariable Integer id) {
        bloqueoService.eliminarBloqueo(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

    @GetMapping("/leer/{id}")
    public ResponseEntity<LeerUsuariosBloqueadosIdDTO> leerBloqueoPorId(@PathVariable Integer id) {
        return new ResponseEntity<>(bloqueoService.leerBloqueoPorId(id), HttpStatus.OK);
    }

    @GetMapping("/buscar-por-usuario/{idUsuario}")
    public ResponseEntity<List<LeerUsuariosBloqueadosIdDTO>> buscarPorUsuarioInvolucrado(@PathVariable Integer idUsuario) {
        return new ResponseEntity<>(bloqueoService.buscarPorUsuarioInvolucrado(idUsuario), HttpStatus.OK);
    }

    @GetMapping("/buscar-relacion")
    public ResponseEntity<LeerUsuariosBloqueadosIdDTO> buscarRelacionSimultanea(@RequestParam Integer idUsuarioQueBloquea, @RequestParam Integer idUsuarioBloqueado) {
        return new ResponseEntity<>(bloqueoService.buscarRelacionSimultanea(idUsuarioQueBloquea, idUsuarioBloqueado), HttpStatus.OK);
    }

    @GetMapping
    public ResponseEntity<List<LeerUsuariosBloqueadosIdDTO>> leerTodosLosBloqueos() {
        return new ResponseEntity<>(bloqueoService.leerTodosLosBloqueos(), HttpStatus.OK);
    }

}