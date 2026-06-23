package com.example.usuarioApi.Controller;

import com.example.usuarioApi.DTO.ClasesdenunciasDTO.CrearDenunciaDTO;
import com.example.usuarioApi.DTO.ClasesdenunciasDTO.DenunciaDetalleDTO;
import com.example.usuarioApi.Model.Denuncia;
import com.example.usuarioApi.Service.DenunciaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/denunciasApi")
@CrossOrigin(origins = "*") 
public class DenunciaController {

    @Autowired
    private DenunciaService denunciaService;

    @PostMapping("/crear") //Metodo post
    public ResponseEntity<?> crearDenuncia(
            @RequestBody CrearDenunciaDTO crearDenunciaDTO) {
        try {
            Denuncia nuevaDenuncia = denunciaService.registrarDenuncia(crearDenunciaDTO);
            return ResponseEntity.ok(nuevaDenuncia);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error al registrar la denuncia: " + e.getMessage());
        }
    }

    //Metodo get
    @GetMapping("/listar")
    public ResponseEntity<List<DenunciaDetalleDTO>> listarDenuncias() {
        return ResponseEntity.ok(denunciaService.listarTodasDetalle());
    }

    //Metodo get
    @GetMapping("/{id}")
    public ResponseEntity<?> obtenerDenunciaPorId(@PathVariable Integer id) {
        try {
            DenunciaDetalleDTO dto = denunciaService.obtenerDetallePorId(id);
            return ResponseEntity.ok(dto);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error al obtener la denuncia: " + e.getMessage());
        }
    }

    // metodo delete
    @DeleteMapping("/eliminar/{id}")
    public ResponseEntity<?> eliminarDenuncia(@PathVariable Integer id) {
        try {
            denunciaService.eliminarDenuncia(id);
            return ResponseEntity.ok("Denuncia eliminada exitosamente.");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error al eliminar la denuncia: " + e.getMessage());
        }
    }
}