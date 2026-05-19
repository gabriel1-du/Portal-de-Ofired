package com.example.usuarioApi.Repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.example.usuarioApi.Model.MedioDePago;

@Repository
public interface MedioDePagoRepository extends JpaRepository<MedioDePago, Integer> {
    
}
