package com.example.publicacionesApi.Controller;

import com.example.publicacionesApi.DTO.ClasesPublicacionesDTO.CrearPublicacionDTO;
import com.example.publicacionesApi.DTO.ClasesPublicacionesDTO.leerPublicacionesDTO;
import com.example.publicacionesApi.Service.PublicacionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/publicacionesApi")
public class PublicacionController {

    @Autowired
    private PublicacionService publicacionService;

    @GetMapping
    public ResponseEntity<List<leerPublicacionesDTO>> listarTodas() {
        return ResponseEntity.ok(publicacionService.listarTodas());
    }

    @GetMapping("/{id}")
    public ResponseEntity<leerPublicacionesDTO> obtenerPorId(@PathVariable Integer id) {
        return ResponseEntity.ok(publicacionService.obtenerPorId(id));
    }

    @PostMapping
    public ResponseEntity<leerPublicacionesDTO> crear(@RequestBody CrearPublicacionDTO publicacionDTO) {
        return ResponseEntity.ok(publicacionService.crear(publicacionDTO));
    }

    @PutMapping("/{id}")
    public ResponseEntity<leerPublicacionesDTO> actualizar(@PathVariable Integer id, @RequestBody CrearPublicacionDTO publicacionDTO) {
        return ResponseEntity.ok(publicacionService.actualizar(id, publicacionDTO));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Integer id) {
        publicacionService.eliminar(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/autor/{idAutor}")
    public ResponseEntity<List<leerPublicacionesDTO>> listarPorAutor(@PathVariable Integer idAutor) {
        return ResponseEntity.ok(publicacionService.listarPorAutor(idAutor));
    }

    @GetMapping("/region/{idRegion}")
    public ResponseEntity<List<leerPublicacionesDTO>> listarPorRegion(@PathVariable Integer idRegion) {
        return ResponseEntity.ok(publicacionService.listarPorRegion(idRegion));
    }

    @GetMapping("/comuna/{idComuna}")
    public ResponseEntity<List<leerPublicacionesDTO>> listarPorComuna(@PathVariable Integer idComuna) {
        return ResponseEntity.ok(publicacionService.listarPorComuna(idComuna));
    }

    @PatchMapping("/{id}/like")
    public ResponseEntity<leerPublicacionesDTO> darLike(@PathVariable Integer id) {
        return ResponseEntity.ok(publicacionService.darLike(id));
    }

    @GetMapping("/nombre/{nombrePublicacion}")
    public ResponseEntity<List<leerPublicacionesDTO>> listarPornombrePublicacion(@PathVariable String nombrePublicacion) {
        return ResponseEntity.ok(publicacionService.listarPornombrePublicacion(nombrePublicacion));
    }
}