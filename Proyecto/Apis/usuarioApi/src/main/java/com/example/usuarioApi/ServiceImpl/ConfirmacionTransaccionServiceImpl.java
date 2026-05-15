package com.example.usuarioApi.ServiceImpl;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.usuarioApi.DTO.ClasesConfirmacionTransaccionDTO.ActualizarConfirmacionTransaccionDTO;
import com.example.usuarioApi.DTO.ClasesConfirmacionTransaccionDTO.CrearConfirmacionTransaccionDTO;
import com.example.usuarioApi.DTO.ClasesConfirmacionTransaccionDTO.LeerConfirmacionTransaccionDTO;
import com.example.usuarioApi.DTO.ClasesConfirmacionTransaccionDTO.LeerConfirmacionTransaccionFrontDTO;
import com.example.usuarioApi.DTO.ClasesConfirmacionTransaccionDTO.ConfirmacionTransaccionMapper;
import com.example.usuarioApi.Model.ConfirmacionTransaccion;
import com.example.usuarioApi.Model.MedioDePago;
import com.example.usuarioApi.Model.TipoDeTrabajo;
import com.example.usuarioApi.Model.Usuario;
import com.example.usuarioApi.Repository.ConfirmacionTransaccionRepository;
import com.example.usuarioApi.Repository.MedioDePagoRepository;
import com.example.usuarioApi.Repository.TipoDeTrabajoRepository;
import com.example.usuarioApi.Repository.UsuarioRepository;
import com.example.usuarioApi.Service.ConfirmacionTransaccionService;

@Service
public class ConfirmacionTransaccionServiceImpl implements ConfirmacionTransaccionService {

    @Autowired
    private ConfirmacionTransaccionRepository transaccionRepository;

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private MedioDePagoRepository medioPagoRepository;

    @Autowired
    private TipoDeTrabajoRepository tipoTrabajoRepository;

    @Autowired
    private ConfirmacionTransaccionMapper mapper;

    @Override
    @Transactional
    public LeerConfirmacionTransaccionFrontDTO crearTransaccion(CrearConfirmacionTransaccionDTO dto) {
        Usuario oferente = usuarioRepository.findById(dto.getIdUsuarioOferente())
                .orElseThrow(() -> new RuntimeException("Usuario oferente no encontrado"));
        Usuario cliente = usuarioRepository.findById(dto.getIdUsuarioCliente())
                .orElseThrow(() -> new RuntimeException("Usuario cliente no encontrado"));
        MedioDePago medioPago = medioPagoRepository.findById(dto.getIdMedioPago())
                .orElseThrow(() -> new RuntimeException("Medio de pago no encontrado"));
        TipoDeTrabajo tipoTrabajo = tipoTrabajoRepository.findById(dto.getIdTipoTrabajo())
                .orElseThrow(() -> new RuntimeException("Tipo de trabajo no encontrado"));

        ConfirmacionTransaccion nuevaTransaccion = mapper.mapToEntityCrear(dto, oferente, cliente, medioPago, tipoTrabajo);
        ConfirmacionTransaccion guardada = transaccionRepository.save(nuevaTransaccion);

        return mapper.mapToLeerFrontDTO(guardada);
    }

    @Override
    @Transactional(readOnly = true)
    public LeerConfirmacionTransaccionFrontDTO leerTransaccionPorId(Integer id) {
        return transaccionRepository.findById(id)
                .map(mapper::mapToLeerFrontDTO)
                .orElseThrow(() -> new RuntimeException("Transacción no encontrada con ID: " + id));
    }

    @Override
    @Transactional
    public LeerConfirmacionTransaccionFrontDTO actualizarEstado(Integer id, ActualizarConfirmacionTransaccionDTO dto) {
        ConfirmacionTransaccion entidad = transaccionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Transacción no encontrada con ID: " + id));
        
        entidad.setAceptado(dto.getAceptado());
        ConfirmacionTransaccion actualizada = transaccionRepository.save(entidad);
        
        return mapper.mapToLeerFrontDTO(actualizada);
    }

    @Override
    @Transactional
    public void eliminarTransaccion(Integer id) {
        transaccionRepository.deleteById(id);
    }

    @Override
    @Transactional(readOnly = true)
    public List<LeerConfirmacionTransaccionFrontDTO> leerTodasLasTransaccionesFront() {
        return transaccionRepository.findAll().stream().map(mapper::mapToLeerFrontDTO).collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<LeerConfirmacionTransaccionDTO> leerTodasLasTransaccionesId() {
        return transaccionRepository.findAll().stream().map(mapper::mapToLeerIdDTO).collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<LeerConfirmacionTransaccionFrontDTO> buscarPorUsuarioInvolucrado(Integer idUsuario) {
        return transaccionRepository.buscarPorCualquierUsuario(idUsuario).stream().map(mapper::mapToLeerFrontDTO).collect(Collectors.toList());
    }
}