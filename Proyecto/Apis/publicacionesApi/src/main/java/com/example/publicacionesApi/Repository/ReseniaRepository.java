package com.example.publicacionesApi.Repository;

import com.example.publicacionesApi.Model.Resenia;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Repository
public interface ReseniaRepository extends JpaRepository<Resenia, Integer> {

    List<Resenia> findByIdAutor(Integer idAutor);
    List<Resenia> findByIdUsuarioReseniado(Integer idUsuarioReseniado);

    @Transactional
    @Modifying
    @Query("DELETE FROM Resenia r WHERE r.idAutor = :idAutor OR r.idUsuarioReseniado = :idUsuario") //[cite: 23]
    void eliminarPorUsuario(Integer idAutor, Integer idUsuario);
    

    
}