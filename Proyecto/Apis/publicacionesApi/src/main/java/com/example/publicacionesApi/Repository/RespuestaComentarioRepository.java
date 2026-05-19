package com.example.publicacionesApi.Repository;

import com.example.publicacionesApi.Model.RespuestaComentario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface RespuestaComentarioRepository extends JpaRepository<RespuestaComentario, Long> {
    // Esto nos servirá para traer las respuestas asociadas a un comentario padre
    List<RespuestaComentario> findByIdComentario(Integer idComentario);
}