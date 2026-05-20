package com.example.publicacionesApi.Service;

import com.example.publicacionesApi.Model.Comentario;
import java.util.List;

public interface ComentarioService {
    Comentario guardarComentario(Comentario comentario);
    List<Comentario> obtenerComentariosPorPublicacion(Integer idPublicacion); 
    
    // CORRECCIÓN: Se cambió Long a Integer para coincidir con la llave primaria
    void eliminarComentario(Integer idComentario);
}