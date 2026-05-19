package com.example.publicacionesApi.Controller;

import com.example.publicacionesApi.Model.Comentario;
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
@CrossOrigin(origins = "*") // Permite que React se conecte sin problemas de CORS
public class ComentarioController {

    @Autowired
    private ComentarioService comentarioService;

    @Autowired
    private RespuestaComentarioService respuestaService;

    // --- ENDPOINTS PARA COMENTARIOS ---

    // 1. Guardar un nuevo comentario en una publicación
    @PostMapping
    public ResponseEntity<Comentario> crearComentario(@RequestBody Comentario comentario) {
        Comentario nuevoComentario = comentarioService.guardarComentario(comentario);
        return new ResponseEntity<>(nuevoComentario, HttpStatus.CREATED);
    }

    // 2. Obtener todos los comentarios de una publicación específica
    @GetMapping("/publicacion/{idPublicacion}")
    public ResponseEntity<List<Comentario>> listarComentariosPorPublicacion(@PathVariable Integer idPublicacion) { // Cambiado a Integer
        List<Comentario> comentarios = comentarioService.obtenerComentariosPorPublicacion(idPublicacion);
        return ResponseEntity.ok(comentarios);
    }

    // 3. Eliminar un comentario
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminarComentario(@PathVariable Long id) {
        comentarioService.eliminarComentario(id);
        return ResponseEntity.noContent().build();
    }

    // --- ENDPOINTS PARA RESPUESTAS ---

    // 4. Guardar una respuesta a un comentario
    @PostMapping("/respuesta")
    public ResponseEntity<RespuestaComentario> crearRespuesta(@RequestBody RespuestaComentario respuesta) {
        RespuestaComentario nuevaRespuesta = respuestaService.guardarRespuesta(respuesta);
        return new ResponseEntity<>(nuevaRespuesta, HttpStatus.CREATED);
    }

    // 5. Obtener todas las respuestas de un comentario padre
    @GetMapping("/respuesta/comentario/{idComentario}")
    public ResponseEntity<List<RespuestaComentario>> listarRespuestasPorComentario(@PathVariable Integer idComentario) { // Cambiado a Integer
        List<RespuestaComentario> respuestas = respuestaService.obtenerRespuestasPorComentario(idComentario);
        return ResponseEntity.ok(respuestas);
    }

    // 6. Eliminar una respuesta
    @DeleteMapping("/respuesta/{id}")
    public ResponseEntity<Void> eliminarRespuesta(@PathVariable Long id) {
        respuestaService.eliminarRespuesta(id);
        return ResponseEntity.noContent().build();
    }
}