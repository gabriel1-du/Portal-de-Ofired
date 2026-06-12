package com.example.usuarioApi.Controller;

import com.example.usuarioApi.DTO.ClasesDenunciaDTO.CrearDenunciaDTO;
import com.example.usuarioApi.Model.Denuncia;
import com.example.usuarioApi.Service.DenunciaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/denuncias")
@CrossOrigin(origins = "*") 
public class DenunciaController {

    @Autowired
    private DenunciaService denunciaService;

    // 1. CREAR DENUNCIA (Original)
    @PostMapping("/crear")
    public ResponseEntity<?> crearDenuncia(
            @RequestHeader("X-Usuario-Id") Integer idUsuarioDenunciante, 
            @RequestBody CrearDenunciaDTO crearDenunciaDTO) {
        try {
            Denuncia nuevaDenuncia = denunciaService.registrarDenuncia(idUsuarioDenunciante, crearDenunciaDTO);
            return ResponseEntity.ok(nuevaDenuncia);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error al registrar la denuncia: " + e.getMessage());
        }
    }

    // 2. LISTAR DENUNCIAS (Original)
    @GetMapping("/listar")
    public ResponseEntity<List<Denuncia>> listarDenuncias() {
        return ResponseEntity.ok(denunciaService.listarTodas());
    }

    // 3. NUEVO: ELIMINAR DENUNCIA
    @DeleteMapping("/eliminar/{id}")
    public ResponseEntity<?> eliminarDenuncia(@PathVariable Integer id) {
        try {
            // Descomenta y asegúrate de crear este método en tu DenunciaService
            // denunciaService.eliminarDenuncia(id);
            return ResponseEntity.ok("Denuncia eliminada correctamente");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error al eliminar la denuncia: " + e.getMessage());
        }
    }

    // 4. NUEVO: APROBAR O RECHAZAR DENUNCIA (Cambiar estado)
    @PutMapping("/estado/{id}")
    public ResponseEntity<?> cambiarEstadoDenuncia(
            @PathVariable Integer id, 
            @RequestParam String accion) {
        try {
            // Descomenta y asegúrate de crear este método en tu DenunciaService
            // denunciaService.cambiarEstado(id, accion);
            return ResponseEntity.ok("Estado de la denuncia actualizado a: " + accion);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error al cambiar estado: " + e.getMessage());
        }
    }
}