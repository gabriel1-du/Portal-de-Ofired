package com.example.usuarioApi.auth;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import com.example.usuarioApi.DTO.clasesUsuarioDTO.leerUsuarioDTO;
import com.example.usuarioApi.Service.UsuarioService;

@RestController
@RequestMapping("/api/auth")
public class authController {

       @Autowired
    private UsuarioService usuarioService;

    @PostMapping("/login")
    public ResponseEntity<leerUsuarioDTO> login(@RequestBody authRequest authRequest) {
        try {
            leerUsuarioDTO usuario = usuarioService.iniciarSesion(authRequest.getEmail(), authRequest.getPassword());
            return ResponseEntity.ok(usuario);
        } catch (RuntimeException ex) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Credenciales no validas");
        }
    }

}
