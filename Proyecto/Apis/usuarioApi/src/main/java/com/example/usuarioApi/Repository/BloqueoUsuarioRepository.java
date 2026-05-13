package com.example.usuarioApi.Repository;

import java.util.List;
import java.util.Optional;

import com.example.usuarioApi.Model.UsuariosBloqueados;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;


@Repository
public interface BloqueoUsuarioRepository extends JpaRepository<UsuariosBloqueados, Integer> {

    // Busca todas las filas donde un usuario dado participa (ya sea que él bloquee o haya sido bloqueado)
    @Query("SELECT ub FROM UsuariosBloqueados ub WHERE ub.usuarioQueBloquea.idUsuario = :idUsuario OR ub.usuarioBloqueado.idUsuario = :idUsuario")
    List<UsuariosBloqueados> buscarPorCualquierUsuario(@Param("idUsuario") Integer idUsuario);

    // Busca la existencia de un bloqueo simultáneo entre dos usuarios específicos
    Optional<UsuariosBloqueados> findByUsuarioQueBloquea_IdUsuarioAndUsuarioBloqueado_IdUsuario(Integer idUsuarioQueBloquea, Integer idUsuarioBloqueado);
}