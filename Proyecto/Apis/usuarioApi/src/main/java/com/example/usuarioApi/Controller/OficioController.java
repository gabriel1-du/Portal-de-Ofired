package com.example.usuarioApi.Controller;

import com.example.usuarioApi.DTO.ClasesOficioDTO.crearOficioDTO;
import com.example.usuarioApi.DTO.ClasesOficioDTO.leerOficioDTO;
import com.example.usuarioApi.Model.Oficio;
import com.example.usuarioApi.Service.OficioService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("api/oficiosApi")
public class OficioController {

    @Autowired
    private OficioService oficioService;

    @GetMapping
    public ResponseEntity<List<leerOficioDTO>> obtenerTodosLosOficios() {
        return ResponseEntity.ok(oficioService.leerTodosLosOficios());
    }

    @GetMapping("/{id}")
    public ResponseEntity<leerOficioDTO> obtenerOficioPorId(@PathVariable Integer id) {
        return ResponseEntity.ok(oficioService.leerOficioPorId(id));
    }

    @PostMapping
    public ResponseEntity<Oficio> crearOficio(@RequestBody crearOficioDTO oficioDTO) {
        return new ResponseEntity<>(oficioService.crearOficio(oficioDTO), HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Oficio> actualizarOficio(@PathVariable Integer id, @RequestBody crearOficioDTO oficioDTO) {
        return ResponseEntity.ok(oficioService.actualizarOficio(id, oficioDTO));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminarOficio(@PathVariable Integer id) {
        oficioService.eliminarOficio(id);
        return ResponseEntity.noContent().build();
    }
}