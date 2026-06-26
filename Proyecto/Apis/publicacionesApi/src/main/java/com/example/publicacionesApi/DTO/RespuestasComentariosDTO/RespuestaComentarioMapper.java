package com.example.publicacionesApi.DTO.RespuestasComentariosDTO;

import com.example.publicacionesApi.Model.RespuestaComentario;
import org.springframework.stereotype.Component;

@Component
public class RespuestaComentarioMapper {

    public RespuestaComentario toEntity(CrearRespuestaComentarioDTO dto) {
        if (dto == null) {
            return null;
        }
        RespuestaComentario respuesta = new RespuestaComentario();
        respuesta.setIdComentario(dto.getIdComentario());
        respuesta.setIdUsuario(dto.getIdUsuario());
        respuesta.setContenido(dto.getContenido());
        return respuesta;
    }

    public LeerRespuestaComentarioDTO toDTO(RespuestaComentario respuesta) {
        if (respuesta == null) {
            return null;
        }
        LeerRespuestaComentarioDTO dto = new LeerRespuestaComentarioDTO();
        dto.setIdRespuesta(respuesta.getIdRespuesta());
        dto.setIdComentario(respuesta.getIdComentario());
        dto.setIdUsuario(respuesta.getIdUsuario());
        dto.setContenido(respuesta.getContenido());
        dto.setFechaRespuesta(respuesta.getFechaRespuesta());
        return dto;
    }
}