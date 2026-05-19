package com.example.usuarioApi.ServiceImpl;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.usuarioApi.DTO.ClasesMedioDePagoDTO.ActualizarMedioDePagoDTO;
import com.example.usuarioApi.DTO.ClasesMedioDePagoDTO.CrearMedioDePagoDTO;
import com.example.usuarioApi.DTO.ClasesMedioDePagoDTO.LeerMedioDePagoDTO;
import com.example.usuarioApi.DTO.ClasesMedioDePagoDTO.MedioDePagoMapper;
import com.example.usuarioApi.Model.MedioDePago;
import com.example.usuarioApi.Repository.MedioDePagoRepository;
import com.example.usuarioApi.Service.MedioDePagoService;

@Service
public class MedioDePagoServiceImpl implements MedioDePagoService {

    @Autowired
    private MedioDePagoRepository repository;

    @Autowired
    private MedioDePagoMapper mapper;

    @Override
    @Transactional
    public LeerMedioDePagoDTO crearMedioDePago(CrearMedioDePagoDTO dto) {
        MedioDePago entidad = mapper.mapToEntityCrear(dto);
        return mapper.mapToLeerDTO(repository.save(entidad));
    }

    @Override
    @Transactional(readOnly = true)
    public LeerMedioDePagoDTO leerMedioDePagoPorId(Integer id) {
        return repository.findById(id).map(mapper::mapToLeerDTO).orElse(null);
    }

    @Override
    @Transactional
    public LeerMedioDePagoDTO actualizarMedioDePago(Integer id, ActualizarMedioDePagoDTO dto) {
        MedioDePago entidad = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Medio de pago no encontrado con ID: " + id));
        entidad.setNombreMedioPago(dto.getNombreMedioPago());
        return mapper.mapToLeerDTO(repository.save(entidad));
    }

    @Override
    @Transactional
    public void eliminarMedioDePago(Integer id) {
        repository.deleteById(id);
    }

    @Override
    @Transactional(readOnly = true)
    public List<LeerMedioDePagoDTO> leerTodosLosMediosDePago() {
        return repository.findAll().stream().map(mapper::mapToLeerDTO).collect(Collectors.toList());
    }
}
