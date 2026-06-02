package com.example.usuarioApi.Service;

import java.sql.Timestamp;
import java.util.List;

import org.springframework.web.multipart.MultipartFile;

import com.example.usuarioApi.DTO.PerfilUsuarioDTO.PerfilUsuarioActualizarDTO;
import com.example.usuarioApi.DTO.PerfilUsuarioDTO.PerfilUsuarioCrearDTO;
import com.example.usuarioApi.DTO.PerfilUsuarioDTO.PerfilUsuarioLeerDTO;
import com.example.usuarioApi.DTO.PerfilUsuarioDTO.PerfilUsuarioLeerFrontDTO;

public interface PerfilUsuarioService {

    PerfilUsuarioLeerDTO crearPerfil(PerfilUsuarioCrearDTO dto, MultipartFile archivoBanner);
    PerfilUsuarioLeerDTO obtenerPorId(Integer id);
    PerfilUsuarioLeerDTO obtenerPorIdUsuario(Integer idUsuario);
    List<PerfilUsuarioLeerDTO> obtenerTodos();
    List<PerfilUsuarioLeerDTO> buscarPorRegion(Integer idRegion);
    List<PerfilUsuarioLeerDTO> buscarPorComuna(Integer idComuna);
    List<PerfilUsuarioLeerDTO> buscarPorOficio(Integer idOficio);
    List<PerfilUsuarioLeerDTO> buscarPorFiltros(Integer idRegion, Integer idComuna, Integer idOficio, Timestamp fecha);
    PerfilUsuarioLeerDTO actualizarPerfil(Integer id, PerfilUsuarioActualizarDTO dto, MultipartFile nuevoBanner );
    void eliminarPerfil(Integer id);

    // Método optimizado para la vista de perfil en el frontend
    PerfilUsuarioLeerFrontDTO obtenerPerfilFrontPorIdUsuario(Integer idUsuario);

}
