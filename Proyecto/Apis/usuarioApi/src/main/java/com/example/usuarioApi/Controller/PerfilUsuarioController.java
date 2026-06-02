package com.example.usuarioApi.Controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.example.usuarioApi.DTO.PerfilUsuarioDTO.PerfilUsuarioActualizarDTO;
import com.example.usuarioApi.DTO.PerfilUsuarioDTO.PerfilUsuarioCrearDTO;
import com.example.usuarioApi.DTO.PerfilUsuarioDTO.PerfilUsuarioLeerDTO;
import com.example.usuarioApi.DTO.PerfilUsuarioDTO.PerfilUsuarioLeerFrontDTO;
import com.example.usuarioApi.Service.PerfilUsuarioService;

@RestController
@RequestMapping("/api/perfilesApi")
public class PerfilUsuarioController {

    @Autowired
    private PerfilUsuarioService perfilService;

    // --- CREAR (POST) ---
    // Recibe un JSON pequeño con idUsuario, nombreApodo y fotografiaBanner
    @PostMapping(consumes = { MediaType.MULTIPART_FORM_DATA_VALUE })
    public ResponseEntity<PerfilUsuarioLeerDTO> crearPerfil(
            @RequestPart("perfil") PerfilUsuarioCrearDTO dto,
            @RequestPart(value = "banner", required = false) MultipartFile banner) {
            
        PerfilUsuarioLeerDTO nuevoPerfil = perfilService.crearPerfil(dto, banner);
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

    @GetMapping("/front/usuario/{idUsuario}")
    public ResponseEntity<PerfilUsuarioLeerFrontDTO> obtenerPerfilFront(@PathVariable Integer idUsuario) {
        PerfilUsuarioLeerFrontDTO perfilFront = perfilService.obtenerPerfilFrontPorIdUsuario(idUsuario);
        return ResponseEntity.ok(perfilFront);
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
            @RequestParam(required = false) Integer idOficio,
            @RequestParam(required = false) @org.springframework.format.annotation.DateTimeFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss") java.util.Date fecha) {
        
        java.sql.Timestamp timestamp = (fecha != null) ? new java.sql.Timestamp(fecha.getTime()) : null;
        return ResponseEntity.ok(perfilService.buscarPorFiltros(idRegionUsu, idComunaUsu, idOficio, timestamp));
    }

    // --- ACTUALIZAR (PUT) ---
    @PutMapping(value = "/{id}", consumes = { MediaType.MULTIPART_FORM_DATA_VALUE })
    public ResponseEntity<PerfilUsuarioLeerDTO> actualizarPerfil(
            @PathVariable Integer id, 
            @RequestPart("perfil") PerfilUsuarioActualizarDTO dto,
            @RequestPart(value = "banner", required = false) MultipartFile banner) {
            
        PerfilUsuarioLeerDTO perfilActualizado = perfilService.actualizarPerfil(id, dto, banner);
        return ResponseEntity.ok(perfilActualizado);
    }

    // --- ELIMINAR (DELETE) ---
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminarPerfil(@PathVariable Integer id) {
        perfilService.eliminarPerfil(id);
        return ResponseEntity.noContent().build(); // Devuelve 204 No Content, que es lo estándar al borrar
    }

}
