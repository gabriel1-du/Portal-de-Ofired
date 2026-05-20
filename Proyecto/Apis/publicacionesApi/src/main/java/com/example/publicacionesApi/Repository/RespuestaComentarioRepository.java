package com.example.publicacionesApi.Repository;

import com.example.publicacionesApi.Model.RespuestaComentario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
// CORRECCIÓN: Se cambió Long por Integer para que coincida con el ID del Modelo
public interface RespuestaComentarioRepository extends JpaRepository<RespuestaComentario, Integer> {
    
    // Esto nos servirá para traer las respuestas asociadas a un comentario padre
    List<RespuestaComentario> findByIdComentario(Integer idComentario);
}