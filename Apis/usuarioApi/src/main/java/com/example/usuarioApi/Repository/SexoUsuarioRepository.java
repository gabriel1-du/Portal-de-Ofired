package com.example.usuarioApi.Repository;

import com.example.usuarioApi.Model.SexoUsuario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface SexoUsuarioRepository extends JpaRepository<SexoUsuario, Integer> {
}