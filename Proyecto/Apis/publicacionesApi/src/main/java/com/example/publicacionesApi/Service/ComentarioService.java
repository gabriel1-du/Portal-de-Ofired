package com.example.publicacionesApi.Service;

import com.example.publicacionesApi.Model.Comentario;
import java.util.List;

public interface ComentarioService {
    Comentario guardarComentario(Comentario comentario);
    List<Comentario> obtenerComentariosPorPublicacion(Integer idPublicacion); // Cambiado Long a Integer
    void eliminarComentario(Long idComentario);
}