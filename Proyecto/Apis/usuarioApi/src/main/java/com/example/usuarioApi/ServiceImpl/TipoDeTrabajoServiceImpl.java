package com.example.usuarioApi.ServiceImpl;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.usuarioApi.DTO.ClasesTipoTrabajoDTO.ActualizarTipoDeTrabajoDTO;
import com.example.usuarioApi.DTO.ClasesTipoTrabajoDTO.CrearTipoDeTrabajoDTO;
import com.example.usuarioApi.DTO.ClasesTipoTrabajoDTO.LeerTipoDeTrabajoDTO;
import com.example.usuarioApi.DTO.ClasesTipoTrabajoDTO.TipoDeTrabajoMapper;
import com.example.usuarioApi.Model.TipoDeTrabajo;
import com.example.usuarioApi.Repository.TipoDeTrabajoRepository;
import com.example.usuarioApi.Service.TipoDeTrabajoService;

@Service
public class TipoDeTrabajoServiceImpl implements TipoDeTrabajoService {

    @Autowired
    private TipoDeTrabajoRepository repository;

    @Autowired
    private TipoDeTrabajoMapper mapper;

    @Override
    @Transactional
    public LeerTipoDeTrabajoDTO crearTipoDeTrabajo(CrearTipoDeTrabajoDTO dto) {
        TipoDeTrabajo entidad = mapper.mapToEntityCrear(dto);
        return mapper.mapToLeerDTO(repository.save(entidad));
    }

    @Override
    @Transactional(readOnly = true)
    public LeerTipoDeTrabajoDTO leerTipoDeTrabajoPorId(Integer id) {
        return repository.findById(id).map(mapper::mapToLeerDTO).orElse(null);
    }

    @Override
    @Transactional
    public LeerTipoDeTrabajoDTO actualizarTipoDeTrabajo(Integer id, ActualizarTipoDeTrabajoDTO dto) {
        TipoDeTrabajo entidad = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Tipo de trabajo no encontrado con ID: " + id));
        entidad.setNombreTipoTrabajo(dto.getNombreTipoTrabajo());
        return mapper.mapToLeerDTO(repository.save(entidad));
    }

    @Override
    @Transactional
    public void eliminarTipoDeTrabajo(Integer id) {
        repository.deleteById(id);
    }

    @Override
    @Transactional(readOnly = true)
    public List<LeerTipoDeTrabajoDTO> leerTodosLosTiposDeTrabajo() {
        return repository.findAll().stream().map(mapper::mapToLeerDTO).collect(Collectors.toList());
    }
}
