package com.example.publicacionesApi.Controller;

import com.example.publicacionesApi.DTO.ClasesPublicacionesDTO.CrearPublicacionDTO;
import com.example.publicacionesApi.DTO.ClasesPublicacionesDTO.leerPublicacionesDTO;
import com.example.publicacionesApi.Service.PublicacionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.time.LocalDateTime;

@RestController
@RequestMapping("/api/publicacionesApi")
public class PublicacionController {

    @Autowired
    private PublicacionService publicacionService;

    // Ejemplo de uso: GET /api/publicacionesApi
    @GetMapping
    public ResponseEntity<List<leerPublicacionesDTO>> listarTodas() {
        return ResponseEntity.ok(publicacionService.listarTodas());
    }

    // Ejemplo de uso: GET /api/publicacionesApi/1
    @GetMapping("/{id}")
    public ResponseEntity<leerPublicacionesDTO> obtenerPorId(@PathVariable Integer id) {
        return ResponseEntity.ok(publicacionService.obtenerPorId(id));
    }

    // Ejemplo de uso: POST /api/publicacionesApi
    @PostMapping
    public ResponseEntity<leerPublicacionesDTO> crear(@RequestBody CrearPublicacionDTO publicacionDTO) {
        return ResponseEntity.ok(publicacionService.crear(publicacionDTO));
    }

    // Ejemplo de uso: PUT /api/publicacionesApi/1
    @PutMapping("/{id}")
    public ResponseEntity<leerPublicacionesDTO> actualizar(@PathVariable Integer id, @RequestBody CrearPublicacionDTO publicacionDTO) {
        return ResponseEntity.ok(publicacionService.actualizar(id, publicacionDTO));
    }

    // Ejemplo de uso: DELETE /api/publicacionesApi/1
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Integer id) {
        publicacionService.eliminar(id);
        return ResponseEntity.noContent().build();
    }

    // Ejemplo de uso: GET /api/publicacionesApi/autor/1
    @GetMapping("/autor/{idAutor}")
    public ResponseEntity<List<leerPublicacionesDTO>> listarPorAutor(@PathVariable Integer idAutor) {
        return ResponseEntity.ok(publicacionService.listarPorAutor(idAutor));
    }

    // Ejemplo de uso: GET /api/publicacionesApi/region/1
    @GetMapping("/region/{idRegion}")
    public ResponseEntity<List<leerPublicacionesDTO>> listarPorRegion(@PathVariable Integer idRegion) {
        return ResponseEntity.ok(publicacionService.listarPorRegion(idRegion));
    }

    // Ejemplo de uso: GET /api/publicacionesApi/comuna/1
    @GetMapping("/comuna/{idComuna}")
    public ResponseEntity<List<leerPublicacionesDTO>> listarPorComuna(@PathVariable Integer idComuna) {
        return ResponseEntity.ok(publicacionService.listarPorComuna(idComuna));
    }

    // Ejemplo de uso: PATCH /api/publicacionesApi/1/like
    @PatchMapping("/{id}/like")
    public ResponseEntity<leerPublicacionesDTO> darLike(@PathVariable Integer id) {
        return ResponseEntity.ok(publicacionService.darLike(id));
    }

    // Ejemplo de uso: GET /api/publicacionesApi/nombre/mi-publicacion
    @GetMapping("/nombre/{nombrePublicacion}")
    public ResponseEntity<List<leerPublicacionesDTO>> listarPornombrePublicacion(@PathVariable String nombrePublicacion) {
        return ResponseEntity.ok(publicacionService.listarPornombrePublicacion(nombrePublicacion));
    }

    // Ejemplo de uso (con hora): GET /api/publicacionesApi/buscar?fechaPublicacion=2025-01-01T10:00:00
    // Ejemplo de uso (solo fecha): GET /api/publicacionesApi/buscar?fechaPublicacion=2025-01-01
    @GetMapping("/buscar")
    public ResponseEntity<List<leerPublicacionesDTO>> buscarPublicaciones(
            @RequestParam(required = false) Integer idRegion,
            @RequestParam(required = false) Integer idComuna,
            @RequestParam(required = false) String fechaPublicacion) {

        LocalDateTime fechaParaServicio = null;

        if (fechaPublicacion != null && !fechaPublicacion.trim().isEmpty()) {
            String fechaAProcesar;
            // Verificamos si el cliente ya incluyó la hora en el parámetro (buscando la 'T')
            if (fechaPublicacion.contains("T")) {
                // Si ya tiene la hora, usamos el string tal cual
                fechaAProcesar = fechaPublicacion;
            } else {
                // Si solo viene la fecha, le agregamos la hora de inicio del día (00:00:00)
                fechaAProcesar = fechaPublicacion + "T00:00:00";
            }
            fechaParaServicio = LocalDateTime.parse(fechaAProcesar);
        }

        return ResponseEntity.ok(publicacionService.buscarPublicaciones(idRegion, idComuna, fechaParaServicio));
    }
}