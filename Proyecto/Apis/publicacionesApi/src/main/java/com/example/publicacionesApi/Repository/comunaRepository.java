package com.example.publicacionesApi.Repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.example.publicacionesApi.Model.Comuna;

public interface comunaRepository extends JpaRepository<Comuna, Integer> {

}
