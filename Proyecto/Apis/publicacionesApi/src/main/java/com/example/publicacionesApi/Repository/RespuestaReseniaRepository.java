package com.example.publicacionesApi.Repository;

import com.example.publicacionesApi.Model.RespuestaResenia;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Repository
public interface RespuestaReseniaRepository extends JpaRepository<RespuestaResenia, Integer> {
    
    List<RespuestaResenia> findByResenia_IdResenia(Integer idResenia);
    boolean existsByResenia_IdResenia(Integer idResenia);

    @Transactional
    @Modifying
    @Query("DELETE FROM RespuestaResenia rr WHERE rr.idAutorRes = :idAutorRes") //[cite: 25]
    void eliminarPorAutor(Integer idAutorRes);
}