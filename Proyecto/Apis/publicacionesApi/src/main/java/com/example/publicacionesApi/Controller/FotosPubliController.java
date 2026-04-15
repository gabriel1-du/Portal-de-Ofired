package com.example.publicacionesApi.Controller;

import com.example.publicacionesApi.Model.FotosPubli;
import com.example.publicacionesApi.Service.FotosPubliService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/fotos")
public class FotosPubliController {

    @Autowired
    private FotosPubliService fotosPubliService;

    @GetMapping("/publicacion/{idPublicacion}")
    public ResponseEntity<List<FotosPubli>> listarPorPublicacion(@PathVariable Integer idPublicacion) {
        return ResponseEntity.ok(fotosPubliService.listarPorPublicacion(idPublicacion));
    }

    @PostMapping
    public ResponseEntity<FotosPubli> agregar(@RequestBody FotosPubli fotosPubli) {
        return ResponseEntity.ok(fotosPubliService.agregar(fotosPubli));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Integer id) {
        fotosPubliService.eliminar(id);
        return ResponseEntity.noContent().build();
    }
}