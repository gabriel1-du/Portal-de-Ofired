package com.example.usuarioApi.ServiceImpl;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.usuarioApi.DTO.PerfilUsuarioDTO.PerfilUsuarioActualizarDTO;
import com.example.usuarioApi.DTO.PerfilUsuarioDTO.PerfilUsuarioCrearDTO;
import com.example.usuarioApi.DTO.PerfilUsuarioDTO.PerfilUsuarioLeerDTO;
import com.example.usuarioApi.DTO.PerfilUsuarioDTO.MapToPerfilUsuarioDTO.PerfilUsuarioMapper;
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

    @Override
    @Transactional
    public PerfilUsuarioLeerDTO crearPerfil(PerfilUsuarioCrearDTO dto) {
        // 1. Buscamos al usuario base. Si no existe, lanzamos excepción.
        Usuario usuario = usuarioRepository.findById(dto.getIdUsuario())
                .orElseThrow(() -> new RuntimeException("Error: El usuario con ID " + dto.getIdUsuario() + " no existe."));

        // 2. Validación de seguridad: Evitar que un usuario tenga dos perfiles (Relación 1 a 1)
        if (perfilRepository.findByUsuario_IdUsuario(dto.getIdUsuario()).isPresent()) {
            throw new RuntimeException("Error: El usuario ya posee un perfil de usuario activo.");
        }

        // 3. El Mapper ahora es automático: toma el DTO y el Usuario, 
        // y copia internamente pNombre, apellidos, region, comuna, etc.
        PerfilUsuario nuevaEntidad = mapper.mapToEntityCrear(dto, usuario);

        // 4. Guardamos la entidad y la transformamos al DTO de lectura
        PerfilUsuario guardado = perfilRepository.save(nuevaEntidad);
        return mapper.mapToLeerDTO(guardado);
    }

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
    public List<PerfilUsuarioLeerDTO> buscarPorFiltros(Integer idRegion, Integer idComuna, Integer idOficio) {
        // Usamos el método personalizado del repositorio que maneja filtros opcionales (NULL)
        return perfilRepository.findByFiltrosMultiples(idRegion, idComuna, idOficio).stream()
                .map(mapper::mapToLeerDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public PerfilUsuarioLeerDTO actualizarPerfil(Integer id, PerfilUsuarioActualizarDTO dto) {
        // 1. Buscamos el perfil existente
        PerfilUsuario perfilExistente = perfilRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Perfil no encontrado para actualizar."));

        // 2. Aplicamos solo los cambios de apodo y banner. 
        // Los datos de región, comuna o nombres se mantienen intactos en esta capa.
        mapper.mapToEntityActualizar(dto, perfilExistente);

        // 3. Guardamos y retornamos
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

    // Métodos de búsqueda individual delegados al método de filtros múltiples para mayor eficiencia
    @Override
    @Transactional(readOnly = true)
    public List<PerfilUsuarioLeerDTO> buscarPorRegion(Integer idRegion) {
        return buscarPorFiltros(idRegion, null, null);
    }

    @Override
    @Transactional(readOnly = true)
    public List<PerfilUsuarioLeerDTO> buscarPorComuna(Integer idComuna) {
        return buscarPorFiltros(null, idComuna, null);
    }

    @Override
    @Transactional(readOnly = true)
    public List<PerfilUsuarioLeerDTO> buscarPorOficio(Integer idOficio) {
        return buscarPorFiltros(null, null, idOficio);
    }

}
