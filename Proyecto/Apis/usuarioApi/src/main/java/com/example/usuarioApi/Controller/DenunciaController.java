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

    @GetMapping("/listar")
    public ResponseEntity<List<Denuncia>> listarDenuncias() {
        return ResponseEntity.ok(denunciaService.listarTodas());
    }
}