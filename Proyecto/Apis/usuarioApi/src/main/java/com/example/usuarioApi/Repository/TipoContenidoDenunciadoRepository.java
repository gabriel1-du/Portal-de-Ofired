package com.example.usuarioApi.Repository;

import com.example.usuarioApi.Model.TipoContenidoDenunciado;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TipoContenidoDenunciadoRepository extends JpaRepository<TipoContenidoDenunciado, Integer> {
}