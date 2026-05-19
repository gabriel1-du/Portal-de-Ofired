package com.example.publicacionesApi.Service;

import com.example.publicacionesApi.Model.RespuestaComentario;
import java.util.List;

public interface RespuestaComentarioService {
    RespuestaComentario guardarRespuesta(RespuestaComentario respuesta);
    List<RespuestaComentario> obtenerRespuestasPorComentario(Integer idComentario); // Cambiado Long a Integer
    void eliminarRespuesta(Long idRespuesta);
}