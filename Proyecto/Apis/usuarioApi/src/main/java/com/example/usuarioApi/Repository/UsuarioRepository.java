package com.example.usuarioApi.Repository;

import com.example.usuarioApi.Model.Usuario;

import java.util.Optional;
import java.math.BigDecimal;
import java.sql.Timestamp;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import org.springframework.data.repository.query.Param;

@Repository
public interface UsuarioRepository extends JpaRepository<Usuario, Integer> {

    // Métodos personalizados para buscar por correo electrónico y rut, si es necesario para la lógica de negocio.
    Optional<Usuario> findByCorreoElec(String correoElec);
    Optional<Usuario> findByRut(String rut);

    //Metodos de busqueda
    List<Usuario> findByComunaIdComuna(Integer idComuna);
    List<Usuario> findByRegionIdRegion(Integer idRegion);
    
    @Query("SELECT u FROM Usuario u WHERE " +
           "LOWER(u.pNombre) LIKE LOWER(CONCAT('%', :nombre, '%')) OR " +
           "LOWER(u.sNombre) LIKE LOWER(CONCAT('%', :nombre, '%')) OR " +
           "LOWER(u.pApellido) LIKE LOWER(CONCAT('%', :nombre, '%')) OR " +
           "LOWER(u.sApellido) LIKE LOWER(CONCAT('%', :nombre, '%'))")
    List<Usuario> findByNombre(@Param("nombre") String nombre);
    List<Usuario> findByValoracion(BigDecimal valoracion);
    List<Usuario> findByFechaCreacion(Timestamp fechaCreacion);

    List<Usuario> findByFechaCreacionGreaterThan(Timestamp fechaCreacion);
    List<Usuario> findByFechaCreacionLessThan(Timestamp fechaCreacion);

    //Metodo para busqueda con filtros
    @Query("SELECT u FROM Usuario u WHERE (:idRegion IS NULL OR u.region.idRegion = :idRegion) " +
       "AND (:idComuna IS NULL OR u.comuna.idComuna = :idComuna) " +
       "AND (:idOficio IS NULL OR u.oficio.idOficio = :idOficio) " +
       "AND (:fecha IS NULL OR u.fechaCreacion >= :fecha)")
       List<Usuario> findByFiltros(@Param("idRegion") Integer idRegion, 
                                   @Param("idComuna") Integer idComuna, 
                                   @Param("idOficio") Integer idOficio, 
                                   @Param("fecha") Timestamp fecha);
}