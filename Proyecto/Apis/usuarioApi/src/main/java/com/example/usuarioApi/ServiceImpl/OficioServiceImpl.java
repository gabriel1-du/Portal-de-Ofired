package com.example.usuarioApi.ServiceImpl;

import com.example.usuarioApi.DTO.ClasesOficioDTO.crearOficioDTO;
import com.example.usuarioApi.DTO.ClasesOficioDTO.leerOficioDTO;
import com.example.usuarioApi.Model.Oficio;
import com.example.usuarioApi.Repository.OficioRepository;
import com.example.usuarioApi.Service.OficioService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class OficioServiceImpl implements OficioService {

    @Autowired
    private OficioRepository oficioRepository;

    private leerOficioDTO mapToDto(Oficio oficio) {
        leerOficioDTO dto = new leerOficioDTO();
        dto.setIdOficio(oficio.getIdOficio());
        dto.setNombreOficio(oficio.getNombreOficio());
        return dto;
    }

    @Override
    public List<leerOficioDTO> leerTodosLosOficios() {
        return oficioRepository.findAll().stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Override
    public leerOficioDTO leerOficioPorId(Integer id) {
        Oficio oficio = oficioRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Oficio no encontrado con id: " + id));
        return mapToDto(oficio);
    }

    @Override
    public Oficio crearOficio(crearOficioDTO oficioDTO) {
        Oficio oficio = new Oficio();
        oficio.setNombreOficio(oficioDTO.getNombreOficio());
        return oficioRepository.save(oficio);
    }

    @Override
    public Oficio actualizarOficio(Integer id, crearOficioDTO oficioDTO) {
        Oficio oficioExistente = oficioRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Oficio no encontrado con id: " + id));
        oficioExistente.setNombreOficio(oficioDTO.getNombreOficio());
        return oficioRepository.save(oficioExistente);
    }

    @Override
    public void eliminarOficio(Integer id) {
        Oficio oficioExistente = oficioRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Oficio no encontrado con id: " + id));
        oficioRepository.delete(oficioExistente);
    }
}