package com.example.usuarioApi.Repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.example.usuarioApi.Model.ConfirmacionTransaccion;

@Repository
public interface ConfirmacionTransaccionRepository extends JpaRepository<ConfirmacionTransaccion, Integer> {
}
