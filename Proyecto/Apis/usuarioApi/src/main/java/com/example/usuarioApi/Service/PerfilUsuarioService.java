package com.example.usuarioApi.Service;

import java.util.List;

import com.example.usuarioApi.DTO.PerfilUsuarioDTO.PerfilUsuarioActualizarDTO;
import com.example.usuarioApi.DTO.PerfilUsuarioDTO.PerfilUsuarioCrearDTO;
import com.example.usuarioApi.DTO.PerfilUsuarioDTO.PerfilUsuarioLeerDTO;

public interface PerfilUsuarioService {

    PerfilUsuarioLeerDTO crearPerfil(PerfilUsuarioCrearDTO dto);
    PerfilUsuarioLeerDTO obtenerPorId(Integer id);
    PerfilUsuarioLeerDTO obtenerPorIdUsuario(Integer idUsuario);
    List<PerfilUsuarioLeerDTO> obtenerTodos();
    List<PerfilUsuarioLeerDTO> buscarPorRegion(Integer idRegion);
    List<PerfilUsuarioLeerDTO> buscarPorComuna(Integer idComuna);
    List<PerfilUsuarioLeerDTO> buscarPorOficio(Integer idOficio);
    List<PerfilUsuarioLeerDTO> buscarPorFiltros(Integer idRegion, Integer idComuna, Integer idOficio);
    PerfilUsuarioLeerDTO actualizarPerfil(Integer id, PerfilUsuarioActualizarDTO dto);
    void eliminarPerfil(Integer id);

}
