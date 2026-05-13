package com.example.usuarioApi.ServiceImpl;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.usuarioApi.DTO.ClasesUsuariosBloqueadosDTO.ActualizarUsuariosBloqueadosDTO;
import com.example.usuarioApi.DTO.ClasesUsuariosBloqueadosDTO.CrearUsuariosBloqueadosDTO;
import com.example.usuarioApi.DTO.ClasesUsuariosBloqueadosDTO.LeerUsuariosBloqueadosIdDTO;
import com.example.usuarioApi.DTO.ClasesUsuariosBloqueadosDTO.UsuariosBloqueadosMapper;
import com.example.usuarioApi.Model.Usuario;
import com.example.usuarioApi.Model.UsuariosBloqueados;
import com.example.usuarioApi.Repository.BloqueoUsuarioRepository;
import com.example.usuarioApi.Repository.UsuarioRepository;
import com.example.usuarioApi.Service.UsuariosBloqueadosService;

@Service
public class UsuariosBloqueadosServiceImpl implements UsuariosBloqueadosService {

    @Autowired
    private BloqueoUsuarioRepository bloqueoRepository;

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private UsuariosBloqueadosMapper mapper;

    @Override
    @Transactional
    public LeerUsuariosBloqueadosIdDTO crearBloqueo(CrearUsuariosBloqueadosDTO dto) {
        Usuario usuarioQueBloquea = usuarioRepository.findById(dto.getIdUsuarioQueBloquea())
                .orElseThrow(() -> new RuntimeException("Usuario bloqueador no encontrado"));
        
        Usuario usuarioBloqueado = usuarioRepository.findById(dto.getIdUsuarioBloqueado())
                .orElseThrow(() -> new RuntimeException("Usuario bloqueado no encontrado"));

        UsuariosBloqueados nuevaEntidad = mapper.mapToEntityCrear(dto, usuarioQueBloquea, usuarioBloqueado);
        UsuariosBloqueados guardado = bloqueoRepository.save(nuevaEntidad);
        
        return mapper.mapToLeerIdDTO(guardado);
    }

    @Override
    @Transactional
    public LeerUsuariosBloqueadosIdDTO actualizarBloqueo(Integer id, ActualizarUsuariosBloqueadosDTO dto) {
        UsuariosBloqueados entidad = bloqueoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Bloqueo no encontrado con ID: " + id));
        
        if (dto.getHabilitador() != null) {
            entidad.setHabilitador(dto.getHabilitador());
        }
        
        UsuariosBloqueados actualizado = bloqueoRepository.save(entidad);
        return mapper.mapToLeerIdDTO(actualizado);
    }

    @Override
    @Transactional
    public void eliminarBloqueo(Integer id) {
        bloqueoRepository.deleteById(id);
    }

    @Override
    @Transactional(readOnly = true)
    public LeerUsuariosBloqueadosIdDTO leerBloqueoPorId(Integer id) {
        return bloqueoRepository.findById(id).map(mapper::mapToLeerIdDTO).orElse(null);
    }

    @Override
    @Transactional(readOnly = true)
    public List<LeerUsuariosBloqueadosIdDTO> buscarPorUsuarioInvolucrado(Integer idUsuario) {
        return bloqueoRepository.buscarPorCualquierUsuario(idUsuario).stream().map(mapper::mapToLeerIdDTO).collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public LeerUsuariosBloqueadosIdDTO buscarRelacionSimultanea(Integer idUsuarioQueBloquea, Integer idUsuarioBloqueado) {
        return bloqueoRepository.findByUsuarioQueBloquea_IdUsuarioAndUsuarioBloqueado_IdUsuario(idUsuarioQueBloquea, idUsuarioBloqueado).map(mapper::mapToLeerIdDTO).orElse(null);
    }

    @Override
    @Transactional(readOnly = true)
    public List<LeerUsuariosBloqueadosIdDTO> leerTodosLosBloqueos() {
        return bloqueoRepository.findAll().stream().map(mapper::mapToLeerIdDTO).collect(Collectors.toList());
    }
}