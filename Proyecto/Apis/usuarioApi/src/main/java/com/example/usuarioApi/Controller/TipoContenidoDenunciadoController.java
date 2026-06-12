package com.example.usuarioApi.Controller;

import com.example.usuarioApi.Model.TipoContenidoDenunciado;
import com.example.usuarioApi.Service.TipoContenidoDenunciadoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tipos-contenido-denunciadoApi")
public class TipoContenidoDenunciadoController {

    @Autowired
    private TipoContenidoDenunciadoService service;

    @PostMapping
    public ResponseEntity<TipoContenidoDenunciado> crear(@RequestBody TipoContenidoDenunciado tipoContenidoDenunciado) {
        return ResponseEntity.ok(service.crear(tipoContenidoDenunciado));
    }

    @GetMapping("/{id}")
    public ResponseEntity<TipoContenidoDenunciado> obtenerPorId(@PathVariable Integer id) {
        return ResponseEntity.ok(service.obtenerPorId(id));
    }

    @GetMapping
    public ResponseEntity<List<TipoContenidoDenunciado>> obtenerTodos() {
        return ResponseEntity.ok(service.obtenerTodos());
    }

    @PutMapping("/{id}")
    public ResponseEntity<TipoContenidoDenunciado> actualizar(@PathVariable Integer id, @RequestBody TipoContenidoDenunciado tipoContenidoDenunciado) {
        return ResponseEntity.ok(service.actualizar(id, tipoContenidoDenunciado));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Integer id) {
        service.eliminar(id);
        return ResponseEntity.noContent().build();
    }
}