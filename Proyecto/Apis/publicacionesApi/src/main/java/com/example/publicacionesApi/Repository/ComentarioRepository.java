package com.example.publicacionesApi.Repository;

import com.example.publicacionesApi.Model.Comentario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ComentarioRepository extends JpaRepository<Comentario, Long> {
    // Esto nos servirá para traer todos los comentarios de una publicación específica
    List<Comentario> findByIdPublicacion(Integer idPublicacion);
}