package com.example.publicacionesApi.Controller;

import com.example.publicacionesApi.DTO.ClasesReseniasDTO.ActualizarReseniaDTO;
import com.example.publicacionesApi.DTO.ClasesReseniasDTO.CrearReniaDTO;
import com.example.publicacionesApi.DTO.ClasesReseniasDTO.LeerReseniaDTO;
import com.example.publicacionesApi.DTO.ClasesReseniasDTO.LeerReseniaFrontDTO;
import com.example.publicacionesApi.Service.ReseniaService;
import jakarta.validation.Valid;
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
    public ResponseEntity<List<LeerReseniaDTO>> listarTodas() {
        return ResponseEntity.ok(reseniaService.listarTodas());
    }

    @GetMapping("/front")
    public ResponseEntity<List<LeerReseniaFrontDTO>> listarTodasParaFront() {
        return ResponseEntity.ok(reseniaService.listarTodasParaFront());
    }

    @GetMapping("/{id}")
    public ResponseEntity<LeerReseniaDTO> obtenerPorId(@PathVariable Integer id) {
        return ResponseEntity.ok(reseniaService.obtenerPorId(id));
    }

    @PostMapping
    public ResponseEntity<LeerReseniaDTO> crear(@Valid @RequestBody CrearReniaDTO reseniaDTO) {
        return ResponseEntity.ok(reseniaService.crear(reseniaDTO));
    }

    @PutMapping("/{id}")
    public ResponseEntity<LeerReseniaDTO> actualizar(@PathVariable Integer id, @Valid @RequestBody ActualizarReseniaDTO reseniaDTO) {
        return ResponseEntity.ok(reseniaService.actualizar(id, reseniaDTO));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Integer id) {
        reseniaService.eliminar(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/autor/{idAutor}")
    public ResponseEntity<List<LeerReseniaFrontDTO>> listarPorAutor(@PathVariable Integer idAutor) {
        return ResponseEntity.ok(reseniaService.listarPorAutor(idAutor));
    }

    @GetMapping("/usuario/{idUsuario}")
    public ResponseEntity<List<LeerReseniaFrontDTO>> listarPorUsuarioReseniado(@PathVariable Integer idUsuario) {
        return ResponseEntity.ok(reseniaService.listarPorUsuarioReseniado(idUsuario));
    }
}