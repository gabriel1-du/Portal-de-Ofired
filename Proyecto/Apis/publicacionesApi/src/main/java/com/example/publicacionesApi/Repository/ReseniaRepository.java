package com.example.publicacionesApi.Repository;

import com.example.publicacionesApi.Model.Resenia;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ReseniaRepository extends JpaRepository<Resenia, Integer> {

    List<Resenia> findByIdAutor(Integer idAutor);
    List<Resenia> findByIdUsuarioReseniado(Integer idUsuarioReseniado);
}