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

@Service
public class RespuestaReseniaServiceImpl implements RespuestaReseniaService {

    @Autowired
    private RespuestaReseniaRepository respuestaReseniaRepository;

    @Autowired
    private RespuestaReseniaMapper respuestaReseniaMapper;

    @Override
    public RespuestaReseniaDTO obtenerPorResenia(Integer idResenia) {
        RespuestaResenia respuesta = respuestaReseniaRepository.findByResenia_IdResenia(idResenia)
                .orElseThrow(() -> new RuntimeException("Respuesta no encontrada para la reseña con id: " + idResenia));
        return respuestaReseniaMapper.toRespuestaReseniaDTO(respuesta);
    }

    @Override
    public RespuestaReseniaFrontDTO obtenerPorReseniaFront(Integer idResenia) {
        RespuestaResenia respuesta = respuestaReseniaRepository.findByResenia_IdResenia(idResenia)
                .orElseThrow(() -> new RuntimeException("Respuesta no encontrada para la reseña con id: " + idResenia));
        return respuestaReseniaMapper.toRespuestaReseniaFrontDTO(respuesta);
    }

    @Override
    public RespuestaReseniaDTO crear(crearRespuestaReseniaDTO respuestaReseniaDTO) {
        boolean yaExiste = respuestaReseniaRepository
                .existsByResenia_IdResenia(respuestaReseniaDTO.getIdResenia());
        if (yaExiste) {
            throw new RuntimeException("Ya existe una respuesta para esta reseña");
        }
        RespuestaResenia respuestaResenia = respuestaReseniaMapper.toEntity(respuestaReseniaDTO);
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
