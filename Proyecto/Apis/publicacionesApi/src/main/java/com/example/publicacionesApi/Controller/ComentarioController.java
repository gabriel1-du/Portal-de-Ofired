package com.example.publicacionesApi.Controller;

import com.example.publicacionesApi.DTO.ComentariosDTO.CrearComentarioDTO;
import com.example.publicacionesApi.DTO.ComentariosDTO.LeerComentarioDTO;
import com.example.publicacionesApi.Model.RespuestaComentario;
import com.example.publicacionesApi.Service.ComentarioService;
import com.example.publicacionesApi.Service.RespuestaComentarioService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/comentarios")
@CrossOrigin(origins = "*")
public class ComentarioController {

    @Autowired
    private ComentarioService comentarioService;

    @Autowired
    private RespuestaComentarioService respuestaService;

    @PostMapping
    public ResponseEntity<LeerComentarioDTO> crearComentario(@RequestBody CrearComentarioDTO comentarioDTO) {
        LeerComentarioDTO nuevoComentario = comentarioService.guardarComentario(comentarioDTO);
        return new ResponseEntity<>(nuevoComentario, HttpStatus.CREATED);
    }

    @GetMapping("/publicacion/{idPublicacion}")
    public ResponseEntity<List<LeerComentarioDTO>> listarComentariosPorPublicacion(@PathVariable Integer idPublicacion) { 
        List<LeerComentarioDTO> comentarios = comentarioService.obtenerComentariosPorPublicacion(idPublicacion);
        return ResponseEntity.ok(comentarios);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminarComentario(@PathVariable Integer id) {
        comentarioService.eliminarComentario(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/respuesta")
    public ResponseEntity<RespuestaComentario> crearRespuesta(@RequestBody RespuestaComentario respuesta) {
        RespuestaComentario nuevaRespuesta = respuestaService.guardarRespuesta(respuesta);
        return new ResponseEntity<>(nuevaRespuesta, HttpStatus.CREATED);
    }

    @GetMapping("/respuesta/comentario/{idComentario}")
    public ResponseEntity<List<RespuestaComentario>> listarRespuestasPorComentario(@PathVariable Integer idComentario) { 
        List<RespuestaComentario> respuestas = respuestaService.obtenerRespuestasPorComentario(idComentario);
        return ResponseEntity.ok(respuestas);
    }

    @DeleteMapping("/respuesta/{id}")
    public ResponseEntity<Void> eliminarRespuesta(@PathVariable Integer id) {
        respuestaService.eliminarRespuesta(id);
        return ResponseEntity.noContent().build();
    }
}