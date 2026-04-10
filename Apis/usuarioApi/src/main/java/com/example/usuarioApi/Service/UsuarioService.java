package com.example.usuarioApi.Service;

import com.example.usuarioApi.DTO.clasesUsuarioDTO.crearUsuarioDTO;
import com.example.usuarioApi.DTO.clasesUsuarioDTO.crearUsuarioLVL1DTO;
import com.example.usuarioApi.DTO.clasesUsuarioDTO.crearUsuarioLVL2DTO;
import com.example.usuarioApi.DTO.clasesUsuarioDTO.eliminarUserDTO;
import com.example.usuarioApi.DTO.clasesUsuarioDTO.leerUsuarioDTO;
import com.example.usuarioApi.DTO.clasesUsuarioDTO.actualizarUserDTO;
import com.example.usuarioApi.DTO.clasesUsuarioDTO.actualizarUsuarioDTOAdmin;

import java.util.List;

public interface UsuarioService {

    leerUsuarioDTO crearUsuario(crearUsuarioDTO usuarioDTO);

    leerUsuarioDTO leerUsuario(Integer id); // Método para leer un usuario por su ID (Get)

    leerUsuarioDTO actualizarUsuario(Integer id, actualizarUserDTO usuarioDTO);

    List<leerUsuarioDTO> leertTodosLosUsuariosDto (); // Método para leer todos los usuarios (Get All)

    void eliminarUsuario(Integer id);

    void eliminarUsuarioConIngresoContraseña(Integer id, eliminarUserDTO deleteDTO); // Método para eliminar un usuario con confirmación de contraseña

    leerUsuarioDTO actualizarUsuarioAdmin(Integer id, actualizarUsuarioDTOAdmin usuarioDTO);

    leerUsuarioDTO crearUsuarioLVL1(crearUsuarioLVL1DTO usuarioDTO); // Método específico para crear usuarios de nivel 1 (Usuario no administrador/profesional)

    leerUsuarioDTO crearUsuarioLVL2(crearUsuarioLVL2DTO usuarioDTO); // Método específico para crear usuarios de nivel 1 (Usuario no administrador/profesional)

    //Metodos para iniciar sesión
    leerUsuarioDTO iniciarSesion(String correoElec, String password); 


}
