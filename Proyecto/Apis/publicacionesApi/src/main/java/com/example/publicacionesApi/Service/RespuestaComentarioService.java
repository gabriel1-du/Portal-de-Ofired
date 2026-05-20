package com.example.publicacionesApi.Service;

import com.example.publicacionesApi.Model.RespuestaComentario;
import java.util.List;

public interface RespuestaComentarioService {
    RespuestaComentario guardarRespuesta(RespuestaComentario respuesta);
    List<RespuestaComentario> obtenerRespuestasPorComentario(Integer idComentario); 
    
    // CORRECCIÓN: Se cambió Long a Integer para coincidir con la llave primaria
    void eliminarRespuesta(Integer idRespuesta);
}