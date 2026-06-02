package com.example.usuarioApi.ServiceImpl;

import java.io.IOException;
import java.sql.Timestamp;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import com.example.usuarioApi.DTO.PerfilUsuarioDTO.PerfilUsuarioActualizarDTO;
import com.example.usuarioApi.DTO.PerfilUsuarioDTO.PerfilUsuarioCrearDTO;
import com.example.usuarioApi.DTO.PerfilUsuarioDTO.PerfilUsuarioLeerDTO;
import com.example.usuarioApi.DTO.PerfilUsuarioDTO.PerfilUsuarioLeerFrontDTO;
import com.example.usuarioApi.DTO.PerfilUsuarioDTO.MapToPerfilUsuarioDTO.PerfilUsuarioMapper;
import com.example.usuarioApi.Minio.MinioStorageService;
import com.example.usuarioApi.Model.PerfilUsuario;
import com.example.usuarioApi.Model.Usuario;
import com.example.usuarioApi.Repository.PerfilUsuarioRepository;

import com.example.usuarioApi.Repository.UsuarioRepository;
import com.example.usuarioApi.Service.PerfilUsuarioService;



@Service
public class PerfilUsuarioServiceImpl implements PerfilUsuarioService {
    @Autowired
    private PerfilUsuarioRepository perfilRepository;

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private PerfilUsuarioMapper mapper;

    @Autowired
    private MinioStorageService minioStorageService;

    @Override
    @Transactional //-----METODO PARA CREAR------
    public PerfilUsuarioLeerDTO crearPerfil(PerfilUsuarioCrearDTO dto, MultipartFile archivoBanner) {
        // 1. Buscamos al usuario base
        Usuario usuario = usuarioRepository.findById(dto.getIdUsuario())
                .orElseThrow(() -> new RuntimeException("Error: El usuario con ID " + dto.getIdUsuario() + " no existe."));

        // 2. Validación de seguridad 1 a 1
        if (perfilRepository.findByUsuario_IdUsuario(dto.getIdUsuario()).isPresent()) {
            throw new RuntimeException("Error: El usuario ya posee un perfil activo.");
        }

        // 3. Procesamos el archivo binario del banner si existe
        String urlBanner = "N"; // Valor por defecto
        if (archivoBanner != null && !archivoBanner.isEmpty()) {
            try {
                urlBanner = minioStorageService.subirArchivo(archivoBanner);
            } catch (IOException e) {
                throw new RuntimeException("Error al subir el Banner a MinIO: " + e.getMessage());
            }
        }

        // Rescatamos la foto de perfil que ya tenía el usuario base al registrarse nivel 1
        String urlPerfilOriginal = usuario.getFoto() != null ? usuario.getFoto() : "N";

        // 4. Mapeamos pasando las dos URLs resueltas
        PerfilUsuario nuevaEntidad = mapper.mapToEntityCrear(dto, usuario, urlBanner, urlPerfilOriginal);

        // 5. Guardamos en Aiven
        PerfilUsuario guardado = perfilRepository.save(nuevaEntidad);
        return mapper.mapToLeerDTO(guardado);
    }


    //--------METODOS GET--------
    @Override
    @Transactional(readOnly = true)
    public PerfilUsuarioLeerDTO obtenerPorId(Integer id) {
        PerfilUsuario perfil = perfilRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Perfil no encontrado."));
        return mapper.mapToLeerDTO(perfil);
    }

    @Override
    @Transactional(readOnly = true)
    public PerfilUsuarioLeerDTO obtenerPorIdUsuario(Integer idUsuario) {
        PerfilUsuario perfil = perfilRepository.findByUsuario_IdUsuario(idUsuario)
                .orElseThrow(() -> new RuntimeException("No se encontró un perfil para el usuario especificado."));
        return mapper.mapToLeerDTO(perfil);
    }

    @Override
    @Transactional(readOnly = true)
    public List<PerfilUsuarioLeerDTO> obtenerTodos() {
        return perfilRepository.findAll().stream()
                .map(mapper::mapToLeerDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<PerfilUsuarioLeerDTO> buscarPorFiltros(Integer idRegion, Integer idComuna, Integer idOficio, Timestamp fecha) {
        return perfilRepository.findByFiltrosMultiples(idRegion, idComuna, idOficio, fecha).stream()
                .map(mapper::mapToLeerDTO).collect(Collectors.toList());
    }


    //---METODOS UPDATE Y DELETE---
    @Override
    @Transactional
    public PerfilUsuarioLeerDTO actualizarPerfil(Integer id, PerfilUsuarioActualizarDTO dto, MultipartFile nuevoBanner) {
        // 1. Buscamos el perfil existente en Aiven
        PerfilUsuario perfilExistente = perfilRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Perfil no encontrado para actualizar."));

        // 2. Procesamos el nuevo archivo binario de banner solo si el cliente lo adjuntó
        String nuevaUrlBanner = null; 
        if (nuevoBanner != null && !nuevoBanner.isEmpty()) {
            try {
                nuevaUrlBanner = minioStorageService.subirArchivo(nuevoBanner);
            } catch (IOException e) {
                throw new RuntimeException("Error al actualizar el Banner en MinIO: " + e.getMessage());
            }
        }

        // 3. Aplicamos los cambios al objeto mapeado (pasando la nueva URL si existe)
        mapper.mapToEntityActualizar(dto, perfilExistente, nuevaUrlBanner);

        // 4. Sincronizamos los cambios en Aiven
        PerfilUsuario actualizado = perfilRepository.save(perfilExistente);
        return mapper.mapToLeerDTO(actualizado);
    }
    

    @Override
    @Transactional
    public void eliminarPerfil(Integer id) {
        if (!perfilRepository.existsById(id)) {
            throw new RuntimeException("No se puede eliminar: El perfil no existe.");
        }
        perfilRepository.deleteById(id);
    }

    //----métodos de búsqueda por filtros específicos (que internamente llaman al método de filtros múltiples)----
    @Override
    @Transactional(readOnly = true)
    public List<PerfilUsuarioLeerDTO> buscarPorRegion(Integer idRegion) {
        return buscarPorFiltros(idRegion, null, null, null);
    }

    @Override
    @Transactional(readOnly = true)
    public List<PerfilUsuarioLeerDTO> buscarPorComuna(Integer idComuna) {
        return buscarPorFiltros(null, idComuna, null, null);
    }

    @Override
    @Transactional(readOnly = true)
    public List<PerfilUsuarioLeerDTO> buscarPorOficio(Integer idOficio) {
        return buscarPorFiltros(null, null, idOficio , null);
    }


    @Override
    @Transactional(readOnly = true)
    public PerfilUsuarioLeerFrontDTO obtenerPerfilFrontPorIdUsuario(Integer idUsuario) {
        // Buscamos la entidad en la base de datos
        PerfilUsuario perfil = perfilRepository.findByUsuario_IdUsuario(idUsuario)
                .orElseThrow(() -> new RuntimeException("No se encontró un perfil para el usuario con ID: " + idUsuario));

        // Usamos el nuevo mapeador que trae los nombres de las regiones, comunas, etc.
        return mapper.mapToLeerFrontDTO(perfil);
    }
}
