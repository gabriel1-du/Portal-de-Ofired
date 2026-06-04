package com.example.publicacionesApi.Service;

import com.example.publicacionesApi.DTO.ComentariosDTO.CrearComentarioDTO;
import com.example.publicacionesApi.DTO.ComentariosDTO.LeerComentarioDTO;
import java.util.List;

public interface ComentarioService {
    LeerComentarioDTO guardarComentario(CrearComentarioDTO comentarioDTO);
    List<LeerComentarioDTO> obtenerComentariosPorPublicacion(Integer idPublicacion); 
    
    // CORRECCIÓN: Se cambió Long a Integer para coincidir con la llave primaria
    void eliminarComentario(Integer idComentario);
}