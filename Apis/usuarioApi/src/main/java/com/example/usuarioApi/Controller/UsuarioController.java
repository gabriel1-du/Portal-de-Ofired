package com.example.usuarioApi.Controller;

import com.example.usuarioApi.DTO.clasesUsuarioDTO.actualizarUserDTO;
import com.example.usuarioApi.DTO.clasesUsuarioDTO.actualizarUsuarioDTOAdmin;
import com.example.usuarioApi.DTO.clasesUsuarioDTO.eliminarUserDTO;
import com.example.usuarioApi.DTO.clasesUsuarioDTO.crearUsuarioDTO;
import com.example.usuarioApi.DTO.clasesUsuarioDTO.crearUsuarioLVL1DTO;
import com.example.usuarioApi.DTO.clasesUsuarioDTO.crearUsuarioLVL2DTO;
import com.example.usuarioApi.DTO.clasesUsuarioDTO.leerUsuarioDTO;

import com.example.usuarioApi.Service.UsuarioService;



import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

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

    @PutMapping("/actualziacionAdmin/{id}")
    public ResponseEntity<leerUsuarioDTO> actualizarUsuarioAdmin(@PathVariable Integer id, @RequestBody actualizarUsuarioDTOAdmin usuarioDTO) {
        leerUsuarioDTO usuarioActualizado = usuarioService.actualizarUsuarioAdmin(id, usuarioDTO);
        return ResponseEntity.ok(usuarioActualizado);
    }
   

}
