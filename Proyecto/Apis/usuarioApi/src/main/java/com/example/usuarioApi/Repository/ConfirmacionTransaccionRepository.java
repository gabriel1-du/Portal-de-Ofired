package com.example.usuarioApi.Repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import com.example.usuarioApi.Model.ConfirmacionTransaccion;

@Repository
public interface ConfirmacionTransaccionRepository extends JpaRepository<ConfirmacionTransaccion, Integer> {

    @Query("SELECT c FROM ConfirmacionTransaccion c WHERE c.usuarioOferente.idUsuario = :idUsuario OR c.usuarioCliente.idUsuario = :idUsuario")
    List<ConfirmacionTransaccion> buscarPorCualquierUsuario(@Param("idUsuario") Integer idUsuario);
}
