package com.example.usuarioApi.Service;

import java.util.List;

import com.example.usuarioApi.DTO.ClasesUsuariosBloqueadosDTO.ActualizarUsuariosBloqueadosDTO;
import com.example.usuarioApi.DTO.ClasesUsuariosBloqueadosDTO.CrearUsuariosBloqueadosDTO;
import com.example.usuarioApi.DTO.ClasesUsuariosBloqueadosDTO.LeerUsuariosBloqueadosIdDTO;

public interface UsuariosBloqueadosService {

    LeerUsuariosBloqueadosIdDTO crearBloqueo(CrearUsuariosBloqueadosDTO dto);

    LeerUsuariosBloqueadosIdDTO actualizarBloqueo(Integer id, ActualizarUsuariosBloqueadosDTO dto);

    void eliminarBloqueo(Integer id);

    LeerUsuariosBloqueadosIdDTO leerBloqueoPorId(Integer id);

    List<LeerUsuariosBloqueadosIdDTO> buscarPorUsuarioInvolucrado(Integer idUsuario);

    LeerUsuariosBloqueadosIdDTO buscarRelacionSimultanea(Integer idUsuarioQueBloquea, Integer idUsuarioBloqueado);

    List<LeerUsuariosBloqueadosIdDTO> leerTodosLosBloqueos();

}