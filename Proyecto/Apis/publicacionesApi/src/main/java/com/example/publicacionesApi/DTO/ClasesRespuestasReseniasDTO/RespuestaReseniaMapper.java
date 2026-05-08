package com.example.publicacionesApi.DTO.ClasesRespuestasReseniasDTO;

import com.example.publicacionesApi.Model.RespuestaResenia;
import com.example.publicacionesApi.Model.Resenia;
import com.example.publicacionesApi.Repository.ReseniaRepository;
import com.example.publicacionesApi.Model.Usuario;
import com.example.publicacionesApi.Repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;

@Component
public class RespuestaReseniaMapper {

    @Autowired
    private ReseniaRepository reseniaRepository;

    @Autowired
    private UsuarioRepository usuarioRepository;

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
        Usuario autor = usuarioRepository.findById(respuesta.getIdAutorRes()).orElse(null);
        if (autor != null) {
            dto.setNombreDelAutor(autor.getPNombre() + " " + autor.getPApellido());
            dto.setFotoAutor(autor.getFoto());
        } else {
            dto.setNombreDelAutor("Usuario no encontrado");
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
