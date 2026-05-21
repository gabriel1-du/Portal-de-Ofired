package com.example.publicacionesApi.DTO.ClasesRespuestasReseniasDTO;

import com.example.publicacionesApi.Model.RespuestaResenia;
import com.example.publicacionesApi.Model.Resenia;
import com.example.publicacionesApi.Repository.ReseniaRepository;
import com.example.publicacionesApi.RestClient.UsuarioRestClient;
import com.example.publicacionesApi.RestClientDTO.UsuarioExternoDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;

@Component
public class RespuestaReseniaMapper {

    @Autowired
    private ReseniaRepository reseniaRepository;

    @Autowired
    private UsuarioRestClient usuarioRestClient;

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
        
        // Seteo de fecha con fallback a LocalDateTime.now() si no viene en el registro
        dto.setFechaCreacion(respuesta.getFechaCreacion() != null ? respuesta.getFechaCreacion() : LocalDateTime.now());
        
        return dto;
    }

  
    public RespuestaReseniaFrontDTO toRespuestaReseniaFrontDTO(RespuestaResenia respuesta) {
        if (respuesta == null) return null;
        
        RespuestaReseniaFrontDTO dto = new RespuestaReseniaFrontDTO();
        dto.setIdRespuestaResenia(respuesta.getIdRespuestaResenia());
        
        if (respuesta.getResenia() != null) {
            dto.setIdResenia(respuesta.getResenia().getIdResenia());
        }
        
        // Buscar el nombre y foto del autor de la respuesta
        try {
            UsuarioExternoDTO autor = usuarioRestClient.obtenerUsuarioPorId(respuesta.getIdAutorRes());
            dto.setNombreDelAutor(autor.getPrimerNombre() + " " + autor.getPrimerApellido());
            dto.setFotoAutor(autor.getFoto());
        } catch (Exception e) {
            dto.setNombreDelAutor("Usuario no encontrado");
            dto.setFotoAutor(null);
        }
        
        dto.setTextoRespuestaResenia(respuesta.getTextoRespuestaResenia());
        
        // Seteo de fecha con fallback a LocalDateTime.now() si no viene en el registro
        dto.setFechaCreacion(respuesta.getFechaCreacion() != null ? respuesta.getFechaCreacion() : LocalDateTime.now());
        
        return dto;
    }

    public void updateFromDTO(actualizarRespuestaReseniaDTO dto, RespuestaResenia respuesta) {
        if (dto == null || respuesta == null) return;
        
        respuesta.setTextoRespuestaResenia(dto.getTextoRespuestaResenia());
    }
}
