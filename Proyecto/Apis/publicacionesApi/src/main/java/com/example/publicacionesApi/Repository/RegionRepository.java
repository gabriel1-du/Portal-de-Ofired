package com.example.publicacionesApi.Repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.publicacionesApi.Model.Region;

public interface RegionRepository extends JpaRepository<Region, Integer> {

}
