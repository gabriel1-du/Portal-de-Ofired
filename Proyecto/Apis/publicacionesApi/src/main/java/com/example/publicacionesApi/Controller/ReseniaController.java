package com.example.publicacionesApi.Controller;

import com.example.publicacionesApi.Model.Resenia;
import com.example.publicacionesApi.Service.ReseniaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/resenias")
public class ReseniaController {

    @Autowired
    private ReseniaService reseniaService;

    @GetMapping
    public ResponseEntity<List<Resenia>> listarTodas() {
        return ResponseEntity.ok(reseniaService.listarTodas());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Resenia> obtenerPorId(@PathVariable Integer id) {
        return ResponseEntity.ok(reseniaService.obtenerPorId(id));
    }

    @PostMapping
    public ResponseEntity<Resenia> crear(@RequestBody Resenia resenia) {
        return ResponseEntity.ok(reseniaService.crear(resenia));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Integer id) {
        reseniaService.eliminar(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/autor/{idAutor}")
    public ResponseEntity<List<Resenia>> listarPorAutor(@PathVariable Integer idAutor) {
        return ResponseEntity.ok(reseniaService.listarPorAutor(idAutor));
    }

    @GetMapping("/usuario/{idUsuario}")
    public ResponseEntity<List<Resenia>> listarPorUsuarioReseniado(@PathVariable Integer idUsuario) {
        return ResponseEntity.ok(reseniaService.listarPorUsuarioReseniado(idUsuario));
    }
}