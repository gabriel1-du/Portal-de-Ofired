package com.example.usuarioApi.Controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.usuarioApi.DTO.PerfilUsuarioDTO.PerfilUsuarioActualizarDTO;
import com.example.usuarioApi.DTO.PerfilUsuarioDTO.PerfilUsuarioCrearDTO;
import com.example.usuarioApi.DTO.PerfilUsuarioDTO.PerfilUsuarioLeerDTO;
import com.example.usuarioApi.Service.PerfilUsuarioService;

@RestController
@RequestMapping("/api/perfilesApi")
public class PerfilUsuarioController {

    @Autowired
    private PerfilUsuarioService perfilService;

    // --- CREAR (POST) ---
    // Recibe un JSON pequeño con idUsuario, nombreApodo y fotografiaBanner
    @PostMapping
    public ResponseEntity<PerfilUsuarioLeerDTO> crearPerfil(@RequestBody PerfilUsuarioCrearDTO dto) {
        PerfilUsuarioLeerDTO nuevoPerfil = perfilService.crearPerfil(dto);
        return new ResponseEntity<>(nuevoPerfil, HttpStatus.CREATED);
    }

    // --- LECTURA INDIVIDUAL (GET) ---
    @GetMapping("/{id}")
    public ResponseEntity<PerfilUsuarioLeerDTO> obtenerPerfil(@PathVariable Integer id) {
        return ResponseEntity.ok(perfilService.obtenerPorId(id));
    }

    // Útil para cuando el usuario inicia sesión y quieres buscar su perfil directamente
    @GetMapping("/usuario/{idUsuario}")
    public ResponseEntity<PerfilUsuarioLeerDTO> obtenerPerfilPorUsuario(@PathVariable Integer idUsuario) {
        return ResponseEntity.ok(perfilService.obtenerPorIdUsuario(idUsuario));
    }

    // --- LECTURA GENERAL (GET) ---
    @GetMapping
    public ResponseEntity<List<PerfilUsuarioLeerDTO>> listarTodos() {
        return ResponseEntity.ok(perfilService.obtenerTodos());
    }

    // --- BÚSQUEDAS ESPECÍFICAS (GET) ---
    @GetMapping("/region/{idRegion}")
    public ResponseEntity<List<PerfilUsuarioLeerDTO>> buscarPorRegion(@PathVariable Integer idRegion) {
        return ResponseEntity.ok(perfilService.buscarPorRegion(idRegion));
    }

    @GetMapping("/comuna/{idComuna}")
    public ResponseEntity<List<PerfilUsuarioLeerDTO>> buscarPorComuna(@PathVariable Integer idComuna) {
        return ResponseEntity.ok(perfilService.buscarPorComuna(idComuna));
    }

    @GetMapping("/oficio/{idOficio}")
    public ResponseEntity<List<PerfilUsuarioLeerDTO>> buscarPorOficio(@PathVariable Integer idOficio) {
        return ResponseEntity.ok(perfilService.buscarPorOficio(idOficio));
    }

    // --- BÚSQUEDA COMBINADA (GET) ---
    // Ej: /api/perfiles/buscar?idRegionUsu=5&idOficio=2
    @GetMapping("/buscar")
    public ResponseEntity<List<PerfilUsuarioLeerDTO>> buscarPorFiltros(
            @RequestParam(required = false) Integer idRegionUsu,
            @RequestParam(required = false) Integer idComunaUsu,
            @RequestParam(required = false) Integer idOficio) {
        return ResponseEntity.ok(perfilService.buscarPorFiltros(idRegionUsu, idComunaUsu, idOficio));
    }

    // --- ACTUALIZAR (PUT) ---
    // Recibe un JSON pequeño solo con nombreApodo y/o fotografiaBanner
    @PutMapping("/{id}")
    public ResponseEntity<PerfilUsuarioLeerDTO> actualizarPerfil(
            @PathVariable Integer id, 
            @RequestBody PerfilUsuarioActualizarDTO dto) {
        PerfilUsuarioLeerDTO perfilActualizado = perfilService.actualizarPerfil(id, dto);
        return ResponseEntity.ok(perfilActualizado);
    }

    // --- ELIMINAR (DELETE) ---
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminarPerfil(@PathVariable Integer id) {
        perfilService.eliminarPerfil(id);
        return ResponseEntity.noContent().build(); // Devuelve 204 No Content, que es lo estándar al borrar
    }

}
