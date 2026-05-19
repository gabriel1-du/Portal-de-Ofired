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
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.math.BigDecimal;
import java.sql.Timestamp;

@RestController
@RequestMapping("/api/usuariosApi")
public class UsuarioController {

    @Autowired
    private UsuarioService usuarioService;

 
    @PostMapping
    public ResponseEntity<leerUsuarioDTO> crearUsuarioRaw(@RequestBody crearUsuarioDTO usuarioDTO) {
        leerUsuarioDTO nuevoUsuario = usuarioService.crearUsuario(usuarioDTO);
        return new ResponseEntity<>(nuevoUsuario, HttpStatus.CREATED);
    }

    @PostMapping("/crearUsuarioLVL1")
    public ResponseEntity<leerUsuarioDTO> crearUsuarioLVL1(@RequestBody crearUsuarioLVL1DTO usuarioDTO) {
        leerUsuarioDTO nuevoUsuario = usuarioService.crearUsuarioLVL1(usuarioDTO);
        return new ResponseEntity<>(nuevoUsuario, HttpStatus.CREATED);
    }

    @PostMapping("/crearUsuarioLVL2")
    public ResponseEntity<leerUsuarioDTO> crearUsuarioLVL2(@RequestBody crearUsuarioLVL2DTO usuarioDTO) {
        leerUsuarioDTO nuevoUsuario = usuarioService.crearUsuarioLVL2(usuarioDTO);
        return new ResponseEntity<>(nuevoUsuario, HttpStatus.CREATED);
    }

    @PostMapping("/admin/crear")
    public ResponseEntity<leerUsuarioDTO> crearUsuarioPorAdmin(@RequestBody crearUsuarioDTOAdmin dto) {
        leerUsuarioDTO nuevoUsuario = usuarioService.crearUsuarioAdmin(dto);
        return new ResponseEntity<>(nuevoUsuario, HttpStatus.CREATED);
    }

    @GetMapping("/{id}")
    public ResponseEntity<leerUsuarioDTO> leerUsuario(@PathVariable Integer id) {
        leerUsuarioDTO usuario = usuarioService.leerUsuario(id);
        return ResponseEntity.ok(usuario);
    }

    @PutMapping("/{id}")
    public ResponseEntity<leerUsuarioDTO> actualizarUsuario(@PathVariable Integer id, @RequestBody actualizarUserDTO usuarioDTO) {
        leerUsuarioDTO usuarioActualizado = usuarioService.actualizarUsuario(id, usuarioDTO);
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

    @PutMapping("/updateAdmin/{id}")
    public ResponseEntity<leerUsuarioDTO> actualizarUsuarioAdmin(@PathVariable Integer id, @RequestBody actualizarUsuarioDTOAdmin usuarioDTO) {
        leerUsuarioDTO usuarioActualizado = usuarioService.actualizarUsuarioAdmin(id, usuarioDTO);
        return ResponseEntity.ok(usuarioActualizado);
    }
   
    // --- Endpoint de Búsqueda con Filtros ---
    // Permite filtrar por cualquier combinación de región, comuna y fecha de creación (desde la fecha indicada).
    // Ejemplos de petición:
    // GET http://localhost:8080/api/usuariosApi/buscar/filtrado?idRegion=13
    // GET http://localhost:8080/api/usuariosApi/buscar/filtrado?idRegion=13&idComuna=101
    // GET http://localhost:8080/api/usuariosApi/buscar/filtrado?fecha=2024-01-20 10:30:00
    @GetMapping("/buscar/filtrado")
    public ResponseEntity<List<leerUsuarioDTO>> buscarConFiltros(
            @RequestParam(required = false) Integer idRegion,
            @RequestParam(required = false) Integer idComuna,
            // 1. Recibes exactamente lo que manda React: "2026-03-13"
            @RequestParam(required = false) String fecha) {

        Timestamp fechaParaServicio = null;

        if (fecha != null && !fecha.isEmpty()) {
            // 2. Le concatenas la hora por defecto y lo transformas
            String fechaConHora = fecha + " 00:00:00";
            fechaParaServicio = Timestamp.valueOf(fechaConHora);
        }

        List<leerUsuarioDTO> usuarios = usuarioService.buscarConFiltros(idRegion, idComuna, fechaParaServicio);
        
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
