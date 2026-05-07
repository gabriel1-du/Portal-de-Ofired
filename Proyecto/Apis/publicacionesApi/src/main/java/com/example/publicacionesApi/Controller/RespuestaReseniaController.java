package com.example.publicacionesApi.Controller;

import com.example.publicacionesApi.DTO.ClasesRespuestasReseniasDTO.RespuestaReseniaDTO;
import com.example.publicacionesApi.DTO.ClasesRespuestasReseniasDTO.RespuestaReseniaFrontDTO;
import com.example.publicacionesApi.DTO.ClasesRespuestasReseniasDTO.actualizarRespuestaReseniaDTO;
import com.example.publicacionesApi.DTO.ClasesRespuestasReseniasDTO.crearRespuestaReseniaDTO;
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
    public ResponseEntity<RespuestaReseniaDTO> obtenerPorResenia(@PathVariable Integer idResenia) {
        return ResponseEntity.ok(respuestaReseniaService.obtenerPorResenia(idResenia));
    }

    @GetMapping("/front/resenia/{idResenia}")
    public ResponseEntity<RespuestaReseniaFrontDTO> obtenerPorReseniaFront(@PathVariable Integer idResenia) {
        return ResponseEntity.ok(respuestaReseniaService.obtenerPorReseniaFront(idResenia));
    }

    @PostMapping
    public ResponseEntity<RespuestaReseniaDTO> crear(@RequestBody crearRespuestaReseniaDTO respuestaReseniaDTO) {
        return ResponseEntity.ok(respuestaReseniaService.crear(respuestaReseniaDTO));
    }

    @PutMapping("/{id}")
    public ResponseEntity<RespuestaReseniaDTO> actualizar(@PathVariable Integer id, @RequestBody actualizarRespuestaReseniaDTO respuestaReseniaDTO) {
        return ResponseEntity.ok(respuestaReseniaService.actualizar(id, respuestaReseniaDTO));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Integer id) {
        respuestaReseniaService.eliminar(id);
        return ResponseEntity.noContent().build();
    }
}