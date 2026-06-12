package com.example.usuarioApi.Repository;

import com.example.usuarioApi.Model.Denuncia;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface DenunciaRepository extends JpaRepository<Denuncia, Integer> {
    
    // Este nos va a servir después para mostrarle al Admin todas las denuncias de un usuario específico
    List<Denuncia> findByIdUsuarioDenunciado(Integer idUsuarioDenunciado);
}