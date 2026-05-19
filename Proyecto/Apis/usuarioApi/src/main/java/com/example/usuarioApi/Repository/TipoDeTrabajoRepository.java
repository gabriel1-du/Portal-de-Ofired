package com.example.usuarioApi.Repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.example.usuarioApi.Model.TipoDeTrabajo;

@Repository
public interface TipoDeTrabajoRepository extends JpaRepository<TipoDeTrabajo, Integer> {
    
}
