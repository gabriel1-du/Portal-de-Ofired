package com.example.publicacionesApi.Repository;

import com.example.publicacionesApi.Model.Comentario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
// CORRECCIÓN: Se cambió Long por Integer para que coincida con el ID del Modelo
public interface ComentarioRepository extends JpaRepository<Comentario, Integer> {
    
    // Esto nos servirá para traer todos los comentarios de una publicación específica
    List<Comentario> findByIdPublicacion(Integer idPublicacion);
}