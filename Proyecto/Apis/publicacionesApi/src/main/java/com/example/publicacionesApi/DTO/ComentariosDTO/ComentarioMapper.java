package com.example.publicacionesApi.DTO.ComentariosDTO;

import com.example.publicacionesApi.DTO.ComentariosDTO.CrearComentarioDTO;
import com.example.publicacionesApi.DTO.ComentariosDTO.LeerComentarioDTO;
import com.example.publicacionesApi.Model.Comentario;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;

@Component
public class ComentarioMapper {

    // Convierte CrearComentarioDTO a la Entidad Comentario y asigna la fecha
    public Comentario toEntity(CrearComentarioDTO dto) {
        if (dto == null) {
            return null;
        }

        Comentario comentario = new Comentario();
        comentario.setIdPublicacion(dto.getIdPublicacion());
        comentario.setIdUsuario(dto.getIdUsuario());
        comentario.setContenido(dto.getContenido());
        comentario.setFechaComentario(LocalDateTime.now());

        return comentario;
    }

    // Convierte la Entidad Comentario a LeerComentarioDTO
    public LeerComentarioDTO toDTO(Comentario comentario) {
        if (comentario == null) {
            return null;
        }

        LeerComentarioDTO dto = new LeerComentarioDTO();
        dto.setIdComentario(comentario.getIdComentario());
        dto.setIdPublicacion(comentario.getIdPublicacion());
        dto.setIdUsuario(comentario.getIdUsuario());
        dto.setContenido(comentario.getContenido());
        dto.setFechaComentario(comentario.getFechaComentario());

        return dto;
    }
}
