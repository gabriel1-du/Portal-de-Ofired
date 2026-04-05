package com.example.usuarioApi.Controller;

import com.example.usuarioApi.DTO.clasesUsuarioDTO.actualizarUserDTO;
import com.example.usuarioApi.DTO.clasesUsuarioDTO.crearUsuarioDTO;
import com.example.usuarioApi.DTO.clasesUsuarioDTO.leerUsuarioDTO;

import com.example.usuarioApi.Service.UsuarioService;

import jakarta.persistence.Id;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/usuariosApi")
public class UsuarioController {

    @Autowired
    private UsuarioService usuarioService;

 
    @PostMapping
    public ResponseEntity<leerUsuarioDTO> crearUsuario(@RequestBody crearUsuarioDTO usuarioDTO) {
        leerUsuarioDTO nuevoUsuario = usuarioService.crearUsuario(usuarioDTO);
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

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminarUsuario(@PathVariable Integer id) {
        usuarioService.eliminarUsuario(id, null); // Eliminar el usuario sin necesidad de un DTO adicional
        return ResponseEntity.noContent().build();
    }
   

}
