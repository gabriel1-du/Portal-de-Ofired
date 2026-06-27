package com.example.publicacionesApi.Repository;

import com.example.publicacionesApi.Model.Publicacion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface PublicacionRepository extends JpaRepository<Publicacion, Integer> {

    List<Publicacion> findByIdAutor(Integer idAutor);
    List<Publicacion> findByIdRegion(Integer idRegion);
    List<Publicacion> findByIdComuna(Integer idComuna);
    List<Publicacion> findByTituloPublicacionContainingIgnoreCase(String tituloPublicacion);

    @Query("SELECT p FROM Publicacion p WHERE " +
           "(:idRegion IS NULL OR p.idRegion = :idRegion) AND " +
           "(:idComuna IS NULL OR p.idComuna = :idComuna) AND " +
           "(:fechaPublicacion IS NULL OR p.fechaPublicacion >= :fechaPublicacion)")
    List<Publicacion> findByFiltros(@Param("idRegion") Integer idRegion, @Param("idComuna") Integer idComuna, @Param("fechaPublicacion") LocalDateTime fechaPublicacion);

    @Transactional
    @Modifying
    @Query("DELETE FROM Publicacion p WHERE p.idAutor = :idAutor") //[cite: 22]
    void eliminarPorAutor(Integer idAutor);
}