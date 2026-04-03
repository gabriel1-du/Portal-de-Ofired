package com.example.usuarioApi.Repository;

import com.example.usuarioApi.Model.Oficio;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface OficioRepository extends JpaRepository<Oficio, Integer> {
}