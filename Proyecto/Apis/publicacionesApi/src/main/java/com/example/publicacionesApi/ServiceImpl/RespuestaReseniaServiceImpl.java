package com.example.publicacionesApi.ServiceImpl;

import com.example.publicacionesApi.DTO.ClasesRespuestasReseniasDTO.RespuestaReseniaDTO;
import com.example.publicacionesApi.DTO.ClasesRespuestasReseniasDTO.RespuestaReseniaFrontDTO;
import com.example.publicacionesApi.DTO.ClasesRespuestasReseniasDTO.RespuestaReseniaMapper;
import com.example.publicacionesApi.DTO.ClasesRespuestasReseniasDTO.actualizarRespuestaReseniaDTO;
import com.example.publicacionesApi.DTO.ClasesRespuestasReseniasDTO.crearRespuestaReseniaDTO;
import com.example.publicacionesApi.Model.RespuestaResenia;
import com.example.publicacionesApi.Repository.RespuestaReseniaRepository;
import com.example.publicacionesApi.Service.RespuestaReseniaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class RespuestaReseniaServiceImpl implements RespuestaReseniaService {

    @Autowired
    private RespuestaReseniaRepository respuestaReseniaRepository;

    @Autowired
    private RespuestaReseniaMapper respuestaReseniaMapper;

    @Override
    public List<RespuestaReseniaDTO> listarTodas() {
        return respuestaReseniaRepository.findAll().stream()
                .map(respuestaReseniaMapper::toRespuestaReseniaDTO)
                .collect(Collectors.toList());
    }

    @Override
    public List<RespuestaReseniaFrontDTO> listarTodasFront() {
        return respuestaReseniaRepository.findAll().stream()
                .map(respuestaReseniaMapper::toRespuestaReseniaFrontDTO)
                .collect(Collectors.toList());
    }

    @Override
    public List<RespuestaReseniaDTO> obtenerPorResenia(Integer idResenia) {
        return respuestaReseniaRepository.findByResenia_IdResenia(idResenia).stream()
                .map(respuestaReseniaMapper::toRespuestaReseniaDTO)
                .collect(Collectors.toList());
    }

    @Override
    public List<RespuestaReseniaFrontDTO> obtenerPorReseniaFront(Integer idResenia) {
        return respuestaReseniaRepository.findByResenia_IdResenia(idResenia).stream()
                .map(respuestaReseniaMapper::toRespuestaReseniaFrontDTO)
                .collect(Collectors.toList());
    }

    @Override
    public RespuestaReseniaDTO crear(crearRespuestaReseniaDTO respuestaReseniaDTO) {
        RespuestaResenia respuestaResenia = respuestaReseniaMapper.toEntity(respuestaReseniaDTO);
        
        // Asignamos la fecha actual en el momento de la creación
        respuestaResenia.setFechaCreacion(LocalDateTime.now());
        
        RespuestaResenia respuestaGuardada = respuestaReseniaRepository.save(respuestaResenia);
        return respuestaReseniaMapper.toRespuestaReseniaDTO(respuestaGuardada);
    }

    @Override
    public RespuestaReseniaDTO actualizar(Integer id, actualizarRespuestaReseniaDTO respuestaReseniaDTO) {
        RespuestaResenia respuestaExistente = respuestaReseniaRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Respuesta no encontrada con id: " + id));
        
        respuestaReseniaMapper.updateFromDTO(respuestaReseniaDTO, respuestaExistente);
        
        RespuestaResenia respuestaActualizada = respuestaReseniaRepository.save(respuestaExistente);
        return respuestaReseniaMapper.toRespuestaReseniaDTO(respuestaActualizada);
    }

    @Override
    public void eliminar(Integer id) {
        if (!respuestaReseniaRepository.existsById(id)) {
            throw new RuntimeException("Respuesta no encontrada con id: " + id);
        }
        respuestaReseniaRepository.deleteById(id);
    }
}
