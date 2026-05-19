package com.example.publicacionesApi.Repository;

import com.example.publicacionesApi.Model.RespuestaResenia;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface RespuestaReseniaRepository extends JpaRepository<RespuestaResenia, Integer> {
    
    List<RespuestaResenia> findByResenia_IdResenia(Integer idResenia);
    boolean existsByResenia_IdResenia(Integer idResenia);
}