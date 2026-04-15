package com.example.publicacionesApi.Controller;

import com.example.publicacionesApi.Model.RespuestaResenia;
import com.example.publicacionesApi.Service.RespuestaReseniaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/respuestas")
public class RespuestaReseniaController {

    @Autowired
    private RespuestaReseniaService respuestaReseniaService;

    @GetMapping("/resenia/{idResenia}")
    public ResponseEntity<RespuestaResenia> obtenerPorResenia(@PathVariable Integer idResenia) {
        return ResponseEntity.ok(respuestaReseniaService.obtenerPorResenia(idResenia));
    }

    @PostMapping
    public ResponseEntity<RespuestaResenia> crear(@RequestBody RespuestaResenia respuestaResenia) {
        return ResponseEntity.ok(respuestaReseniaService.crear(respuestaResenia));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Integer id) {
        respuestaReseniaService.eliminar(id);
        return ResponseEntity.noContent().build();
    }
}