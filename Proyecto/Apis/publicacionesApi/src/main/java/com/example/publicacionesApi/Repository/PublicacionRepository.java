package com.example.publicacionesApi.Repository;

import com.example.publicacionesApi.Model.Publicacion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface PublicacionRepository extends JpaRepository<Publicacion, Integer> {

    List<Publicacion> findByIdAutor(Integer idAutor);
    List<Publicacion> findByRegion_IdRegion(Integer idRegion);
    List<Publicacion> findByComuna_IdComuna(Integer idComuna);
    List<Publicacion> findByTituloPublicacionContainingIgnoreCase(String tituloPublicacion);
}