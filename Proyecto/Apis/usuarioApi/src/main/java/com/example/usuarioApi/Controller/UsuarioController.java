package com.example.usuarioApi.Controller;

import com.example.usuarioApi.DTO.clasesUsuarioDTO.actualizarUserDTO;
import com.example.usuarioApi.DTO.clasesUsuarioDTO.actualizarUsuarioDTOAdmin;
import com.example.usuarioApi.DTO.clasesUsuarioDTO.eliminarUserDTO;
import com.example.usuarioApi.DTO.clasesUsuarioDTO.crearUsuarioDTO;
import com.example.usuarioApi.DTO.clasesUsuarioDTO.crearUsuarioDTOAdmin;
import com.example.usuarioApi.DTO.clasesUsuarioDTO.crearUsuarioLVL1DTO;
import com.example.usuarioApi.DTO.clasesUsuarioDTO.crearUsuarioLVL2DTO;
import com.example.usuarioApi.DTO.clasesUsuarioDTO.leerUsuarioDTO;

import com.example.usuarioApi.Service.UsuarioService;



import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import java.util.List;
import java.math.BigDecimal;
import java.sql.Timestamp;

@RestController
@RequestMapping("/api/usuariosApi")
public class UsuarioController {

    @Autowired
    private UsuarioService usuarioService;

 
    @PostMapping(consumes = { MediaType.MULTIPART_FORM_DATA_VALUE })
    public ResponseEntity<leerUsuarioDTO> crearUsuarioRaw(
            @RequestPart("usuario") crearUsuarioDTO usuarioDTO,
            @RequestPart(value = "foto", required = false) MultipartFile archivoFoto) {
        leerUsuarioDTO nuevoUsuario = usuarioService.crearUsuario(usuarioDTO, archivoFoto);
        return new ResponseEntity<>(nuevoUsuario, HttpStatus.CREATED);
    }

    @PostMapping(value = "/crearUsuarioLVL1", consumes = { MediaType.MULTIPART_FORM_DATA_VALUE }) //crear usuario sin oficio
    public ResponseEntity<leerUsuarioDTO> crearUsuarioLVL1(
            @RequestPart("usuario") crearUsuarioLVL1DTO usuarioDTO,
            @RequestPart(value = "foto", required = false) MultipartFile archivoFoto) {
        leerUsuarioDTO nuevoUsuario = usuarioService.crearUsuarioLVL1(usuarioDTO, archivoFoto);
        return new ResponseEntity<>(nuevoUsuario, HttpStatus.CREATED);
    }

    @PostMapping(value = "/crearUsuarioLVL2", consumes = { MediaType.MULTIPART_FORM_DATA_VALUE }) //crear usuario con oficio
    public ResponseEntity<leerUsuarioDTO> crearUsuarioLVL2(
            @RequestPart("usuario") crearUsuarioLVL2DTO usuarioDTO,
            @RequestPart(value = "foto", required = false) MultipartFile archivoFoto) {
        leerUsuarioDTO nuevoUsuario = usuarioService.crearUsuarioLVL2(usuarioDTO, archivoFoto);
        return new ResponseEntity<>(nuevoUsuario, HttpStatus.CREATED);
    }

    @PostMapping(value = "/admin/crear", consumes = { MediaType.MULTIPART_FORM_DATA_VALUE }) // Endpoint específico para que el admin cree un usuario con todos los campos, incluyendo rol y estado
    public ResponseEntity<leerUsuarioDTO> crearUsuarioPorAdmin(
            @RequestPart("usuario") crearUsuarioDTOAdmin dto,
            @RequestPart(value = "foto", required = false) MultipartFile archivoFoto) {
        leerUsuarioDTO nuevoUsuario = usuarioService.crearUsuarioAdmin(dto, archivoFoto);
        return new ResponseEntity<>(nuevoUsuario, HttpStatus.CREATED);
    }

    @GetMapping("/{id}") // Endpoint para leer un usuario específico por su ID
    public ResponseEntity<leerUsuarioDTO> leerUsuario(@PathVariable Integer id) {
        leerUsuarioDTO usuario = usuarioService.leerUsuario(id);
        return ResponseEntity.ok(usuario);
    }

    @PutMapping(value = "/{id}", consumes = { MediaType.MULTIPART_FORM_DATA_VALUE })
    public ResponseEntity<leerUsuarioDTO> actualizarUsuario(
            @PathVariable Integer id, 
            @RequestPart("usuario") actualizarUserDTO usuarioDTO,
            @RequestPart(value = "foto", required = false) MultipartFile archivoFoto) {
        leerUsuarioDTO usuarioActualizado = usuarioService.actualizarUsuario(id, usuarioDTO, archivoFoto);
        return ResponseEntity.ok(usuarioActualizado);
    }

    @GetMapping
    public ResponseEntity<List<leerUsuarioDTO>> leerTodosLosUsuariosDto() {
        List<leerUsuarioDTO> usuarios = usuarioService.leertTodosLosUsuariosDto();
        return ResponseEntity.ok(usuarios);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminarUsuario(@PathVariable Integer id) {
        usuarioService.eliminarUsuario(id);
        return ResponseEntity.noContent().build();
    }

    //Metodo para eliminar un usuario con confirmación de contraseña
    @DeleteMapping("/confirmacionContraseña/{id}")
    public ResponseEntity<Void> eliminarUsuarioConfirmacionContra(@PathVariable Integer id, @RequestBody eliminarUserDTO deleteDTO) {
        usuarioService.eliminarUsuarioConIngresoContraseña(id, deleteDTO);
        return ResponseEntity.noContent().build();
    }

    @PutMapping(value = "/updateAdmin/{id}", consumes = { MediaType.MULTIPART_FORM_DATA_VALUE })
    public ResponseEntity<leerUsuarioDTO> actualizarUsuarioAdmin(
            @PathVariable Integer id, 
            @RequestPart("usuario") actualizarUsuarioDTOAdmin usuarioDTO,
            @RequestPart(value = "foto", required = false) MultipartFile archivoFoto) {
        leerUsuarioDTO usuarioActualizado = usuarioService.actualizarUsuarioAdmin(id, usuarioDTO, archivoFoto);
        return ResponseEntity.ok(usuarioActualizado);
    }
   
    // --- Endpoint de Búsqueda con Filtros ---
    // Permite filtrar por cualquier combinación de región, comuna, oficio y fecha de creación (desde la fecha indicada).
    // Ejemplos de petición:
    // GET http://localhost:8080/api/usuariosApi/buscar/filtrado?idRegion=13
    // GET http://localhost:8080/api/usuariosApi/buscar/filtrado?idRegion=13&idComuna=101
    // GET http://localhost:8080/api/usuariosApi/buscar/filtrado?idOficio=5
    // GET http://localhost:8080/api/usuariosApi/buscar/filtrado?fecha=2024-01-20 10:30:00
    // GET http://localhost:8080/api/usuariosApi/buscar/filtrado?idRegion=13&idComuna=101&idOficio=5&fecha=2024-01-20 10:30:00
    @GetMapping("/buscar/filtrado")
    public ResponseEntity<List<leerUsuarioDTO>> buscarConFiltros(
            @RequestParam(required = false) Integer idRegion,
            @RequestParam(required = false) Integer idComuna,
            @RequestParam(required = false) Integer idOficio,
            // 1. Recibes exactamente lo que manda React: "2026-03-13"
            @RequestParam(required = false) String fecha) {

        Timestamp fechaParaServicio = null;

        if (fecha != null && !fecha.isEmpty()) {
            // 2. Le concatenas la hora por defecto y lo transformas
            String fechaConHora = fecha + " 00:00:00";
            fechaParaServicio = Timestamp.valueOf(fechaConHora);
        }

        List<leerUsuarioDTO> usuarios = usuarioService.buscarConFiltros(idRegion, idComuna, idOficio, fechaParaServicio);
        
        return ResponseEntity.ok(usuarios);
    }

    // --- Endpoints de Búsqueda ---

    @GetMapping("/buscar/por-comuna/{idComuna}")
    public ResponseEntity<List<leerUsuarioDTO>> buscarPorComuna(@PathVariable Integer idComuna) {
        List<leerUsuarioDTO> usuarios = usuarioService.buscarPorComuna(idComuna);
        return ResponseEntity.ok(usuarios);
    }

    @GetMapping("/buscar/por-region/{idRegion}")
    public ResponseEntity<List<leerUsuarioDTO>> buscarPorRegion(@PathVariable Integer idRegion) {
        List<leerUsuarioDTO> usuarios = usuarioService.buscarPorRegion(idRegion);
        return ResponseEntity.ok(usuarios);
    }

    @GetMapping("/buscar/por-nombre/{nombre}")
    public ResponseEntity<List<leerUsuarioDTO>> buscarPorNombre(@PathVariable String nombre) {
        List<leerUsuarioDTO> usuarios = usuarioService.buscarPorNombre(nombre);
        return ResponseEntity.ok(usuarios);
    }

    @GetMapping("/buscar/por-valoracion/{valoracion}")
    public ResponseEntity<List<leerUsuarioDTO>> buscarPorValoracion(@PathVariable BigDecimal valoracion) {
        List<leerUsuarioDTO> usuarios = usuarioService.buscarPorValoracion(valoracion);
        return ResponseEntity.ok(usuarios);
    }

    // Ejemplo de petición en Postman (GET):
    // GET http://localhost:8080/api/usuariosApi/buscar/por-fecha-creacion?fecha=2024-01-20 10:30:00
    @GetMapping("/buscar/por-fecha-creacion")
    public ResponseEntity<List<leerUsuarioDTO>> buscarPorFechaDeCreacion(@RequestParam("fecha") Timestamp fecha) {
        List<leerUsuarioDTO> usuarios = usuarioService.buscarPorFechaDeCreacion(fecha);
        return ResponseEntity.ok(usuarios);
    }

    // Ejemplo de petición: GET http://localhost:8080/api/usuariosApi/buscar/por-fecha-creacion/despues?fecha=2024-01-20 10:30:00
    @GetMapping("/buscar/por-fecha-creacion/despues")
    public ResponseEntity<List<leerUsuarioDTO>> buscarPorFechaDespuesDe(@RequestParam("fecha") Timestamp fecha) {
        List<leerUsuarioDTO> usuarios = usuarioService.buscarPorFechaCreacionDespuesDe(fecha);
        return ResponseEntity.ok(usuarios);
    }

    // Ejemplo de petición: GET http://localhost:8080/api/usuariosApi/buscar/por-fecha-creacion/antes?fecha=2024-01-20 10:30:00
    @GetMapping("/buscar/por-fecha-creacion/antes")
    public ResponseEntity<List<leerUsuarioDTO>> buscarPorFechaAntesDe(@RequestParam("fecha") Timestamp fecha) {
        List<leerUsuarioDTO> usuarios = usuarioService.buscarPorFechaCreacionAntesDe(fecha);
        return ResponseEntity.ok(usuarios);
    }

}
