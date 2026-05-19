package com.example.usuarioApi.ServiceImpl;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
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

    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    @Override
    @Transactional
    public LeerUsuariosBloqueadosIdDTO crearBloqueo(CrearUsuariosBloqueadosDTO dto) {
        // 1. Validar si ya existe un bloqueo previo entre estos dos usuarios
        Optional<UsuariosBloqueados> bloqueoExistente = bloqueoRepository.findByUsuarioQueBloquea_IdUsuarioAndUsuarioBloqueado_IdUsuario(dto.getIdUsuarioQueBloquea(), dto.getIdUsuarioBloqueado());
        
        if (bloqueoExistente.isPresent()) {
            UsuariosBloqueados existente = bloqueoExistente.get();
            // Si existe pero estaba deshabilitado (false), lo volvemos a habilitar (true)
            if (!existente.getHabilitador()) {
                existente.setHabilitador(true);
                UsuariosBloqueados actualizado = bloqueoRepository.save(existente);
                LeerUsuariosBloqueadosIdDTO resultado = mapper.mapToLeerIdDTO(actualizado);
                notificarActualizacionWebSocket(resultado);
                return resultado;
            }
            // Si ya existe y está activo, simplemente lo retornamos para no crear duplicados (y no notificamos de nuevo)
            return mapper.mapToLeerIdDTO(existente);
        }

        // 2. Si no existe en absoluto, procedemos a crearlo
        Usuario usuarioQueBloquea = usuarioRepository.findById(dto.getIdUsuarioQueBloquea())
                .orElseThrow(() -> new RuntimeException("Usuario bloqueador no encontrado"));
        
        Usuario usuarioBloqueado = usuarioRepository.findById(dto.getIdUsuarioBloqueado())
                .orElseThrow(() -> new RuntimeException("Usuario bloqueado no encontrado"));

        UsuariosBloqueados nuevaEntidad = mapper.mapToEntityCrear(dto, usuarioQueBloquea, usuarioBloqueado);
        UsuariosBloqueados guardado = bloqueoRepository.save(nuevaEntidad);
        
        LeerUsuariosBloqueadosIdDTO resultado = mapper.mapToLeerIdDTO(guardado);
        notificarActualizacionWebSocket(resultado);
        return resultado;
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
        LeerUsuariosBloqueadosIdDTO resultado = mapper.mapToLeerIdDTO(actualizado);
        notificarActualizacionWebSocket(resultado);
        return resultado;
    }

    @Override
    @Transactional
    public void eliminarBloqueo(Integer id) {
        UsuariosBloqueados entidad = bloqueoRepository.findById(id).orElse(null);
        if (entidad != null) {
            LeerUsuariosBloqueadosIdDTO dto = mapper.mapToLeerIdDTO(entidad);
            bloqueoRepository.deleteById(id);
            
            // Enviamos la notificación para que el frontend sepa que hubo un cambio 
            // (pueden refrescar su lista o identificar que se eliminó).
            // Seteamos habilitador en falso como indicio, aunque el idBloqueo ya no existe en BD.
            dto.setHabilitador(false);
            notificarActualizacionWebSocket(dto);
        }
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

    private void notificarActualizacionWebSocket(LeerUsuariosBloqueadosIdDTO dto) {
        if (dto != null) {
            messagingTemplate.convertAndSend("/topic/bloqueos/" + dto.getIdUsuarioQueBloquea(), dto);
            messagingTemplate.convertAndSend("/topic/bloqueos/" + dto.getIdUsuarioBloqueado(), dto);
        }
    }
}