package com.example.publicacionesApi.DTO.ClasesRespuestasReseniasDTO;

import com.example.publicacionesApi.Model.RespuestaResenia;
import com.example.publicacionesApi.Model.Resenia;
import com.example.publicacionesApi.Repository.ReseniaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
public class RespuestaReseniaMapper {

    @Autowired
    private ReseniaRepository reseniaRepository;

    public RespuestaResenia toEntity(crearRespuestaReseniaDTO dto) {
        if (dto == null) {
            return null;
        }
        RespuestaResenia respuesta = new RespuestaResenia();
        
        // Buscar y enlazar la Reseña validando que exista en la base de datos
        if (dto.getIdResenia() != null) {
            Resenia resenia = reseniaRepository.findById(dto.getIdResenia())
                .orElseThrow(() -> new RuntimeException("Reseña no encontrada con id: " + dto.getIdResenia()));
            respuesta.setResenia(resenia);
        }
        
        respuesta.setIdAutorRes(dto.getIdAutorRes());
        respuesta.setTextoRespuestaResenia(dto.getTextoRespuestaResenia());
        
        return respuesta;
    }

    
    public RespuestaReseniaDTO toRespuestaReseniaDTO(RespuestaResenia respuesta) {
        if (respuesta == null) {
            return null;
        }
        RespuestaReseniaDTO dto = new RespuestaReseniaDTO();
        dto.setIdRespuestaResenia(respuesta.getIdRespuestaResenia());
        
        if (respuesta.getResenia() != null) {
            dto.setIdResenia(respuesta.getResenia().getIdResenia());
        }
        
        dto.setIdAutorRes(respuesta.getIdAutorRes());
        dto.setTextoRespuestaResenia(respuesta.getTextoRespuestaResenia());
        
        return dto;
    }

  
    public RespuestaReseniaFrontDTO toRespuestaReseniaFrontDTO(RespuestaResenia respuesta) {
        if (respuesta == null) return null;
        
        RespuestaReseniaFrontDTO dto = new RespuestaReseniaFrontDTO();
        dto.setIdRespuestaResenia(respuesta.getIdRespuestaResenia());
        
        if (respuesta.getResenia() != null) {
            dto.setIdResenia(respuesta.getResenia().getIdResenia());
        }
        
        // Nota: 'nombreDelAutor' está definido como Integer en tu DTO. 
        // Lo mapeamos momentáneamente con el ID del autor.
        dto.setNombreDelAutor(respuesta.getIdAutorRes());
        
        dto.setTextoRespuestaResenia(respuesta.getTextoRespuestaResenia());
        
        return dto;
    }

    public void updateFromDTO(actualizarRespuestaReseniaDTO dto, RespuestaResenia respuesta) {
        if (dto == null || respuesta == null) return;
        
        respuesta.setTextoRespuestaResenia(dto.getTextoRespuestaResenia());
    }
}
