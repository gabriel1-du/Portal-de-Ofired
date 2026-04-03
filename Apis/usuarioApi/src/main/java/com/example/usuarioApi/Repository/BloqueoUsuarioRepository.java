package com.example.usuarioApi.Repository;

import com.example.usuarioApi.Model.BloqueoUsuario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface BloqueoUsuarioRepository extends JpaRepository<BloqueoUsuario, Integer> {
}