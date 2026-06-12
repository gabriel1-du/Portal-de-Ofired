package com.example.usuarioApi.Controller;

import com.example.usuarioApi.Model.TipoDenuncia;
import com.example.usuarioApi.Service.TipoDenunciaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tipos-denunciaApi")
public class TipoDenunciaController {

    @Autowired
    private TipoDenunciaService service;

    @PostMapping
    public ResponseEntity<TipoDenuncia> crear(@RequestBody TipoDenuncia tipoDenuncia) {
        return ResponseEntity.ok(service.crear(tipoDenuncia));
    }

    @GetMapping("/{id}")
    public ResponseEntity<TipoDenuncia> obtenerPorId(@PathVariable Integer id) {
        return ResponseEntity.ok(service.obtenerPorId(id));
    }

    @GetMapping
    public ResponseEntity<List<TipoDenuncia>> obtenerTodos() {
        return ResponseEntity.ok(service.obtenerTodos());
    }

    @PutMapping("/{id}")
    public ResponseEntity<TipoDenuncia> actualizar(@PathVariable Integer id, @RequestBody TipoDenuncia tipoDenuncia) {
        return ResponseEntity.ok(service.actualizar(id, tipoDenuncia));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Integer id) {
        service.eliminar(id);
        return ResponseEntity.noContent().build();
    }
}