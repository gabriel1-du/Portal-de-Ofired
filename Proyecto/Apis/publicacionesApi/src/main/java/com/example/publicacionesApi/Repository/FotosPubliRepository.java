package com.example.publicacionesApi.Repository;

import com.example.publicacionesApi.Model.FotosPubli;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface FotosPubliRepository extends JpaRepository<FotosPubli, Integer> {
    
    List<FotosPubli> findByPublicacion_IdPublicacion(Integer idPublicacion);
}