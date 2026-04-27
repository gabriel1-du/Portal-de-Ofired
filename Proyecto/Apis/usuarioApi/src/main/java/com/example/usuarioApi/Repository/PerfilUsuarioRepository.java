package com.example.usuarioApi.Repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.example.usuarioApi.Model.PerfilUsuario;

@Repository
public interface PerfilUsuarioRepository extends JpaRepository<PerfilUsuario, Integer> {

    // Búsquedas individuales
    List<PerfilUsuario> findByRegion_IdRegion(Integer idRegion);
    List<PerfilUsuario> findByComuna_IdComuna(Integer idComuna);
    List<PerfilUsuario> findByOficio_IdOficio(Integer idOficio);
    Optional<PerfilUsuario> findByUsuario_IdUsuario(Integer idUsuario);

    // Búsqueda combinada (Inspirada en tu ejemplo)
    @Query("SELECT p FROM PerfilUsuario p WHERE " +
           "(:idRegion IS NULL OR p.region.idRegion = :idRegion) AND " +
           "(:idComuna IS NULL OR p.comuna.idComuna = :idComuna) AND " +
           "(:idOficio IS NULL OR p.oficio.idOficio = :idOficio)")
    List<PerfilUsuario> findByFiltrosMultiples(
            @Param("idRegion") Integer idRegion,
            @Param("idComuna") Integer idComuna,
            @Param("idOficio") Integer idOficio
    );

}
