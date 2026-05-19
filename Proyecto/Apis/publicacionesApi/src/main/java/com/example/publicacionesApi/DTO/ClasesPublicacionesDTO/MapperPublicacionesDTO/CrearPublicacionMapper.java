package com.example.publicacionesApi.DTO.ClasesPublicacionesDTO.MapperPublicacionesDTO;

import com.example.publicacionesApi.DTO.ClasesPublicacionesDTO.CrearPublicacionDTO;

import com.example.publicacionesApi.Model.Comuna;
import com.example.publicacionesApi.Model.Publicacion;
import com.example.publicacionesApi.Model.Region;
import com.example.publicacionesApi.Repository.comunaRepository;
import com.example.publicacionesApi.Repository.RegionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import java.time.LocalDateTime;

@Component
public class CrearPublicacionMapper {

    @Autowired
    private RegionRepository regionRepository;

    @Autowired
    private comunaRepository comunaRepository;

    //Metodo que se usa para convertir un CrearPublicacionDTO a una entidad Publicacion, validando que la Región y Comuna existan en la base de datos
    public Publicacion crearPublicacionDTOtoPublicacion(CrearPublicacionDTO dto) {
        if (dto == null) {
            return null;
        }

        Publicacion publicacion = new Publicacion();
        publicacion.setIdAutor(dto.getIdAutor());
        publicacion.setTituloPublicacion(dto.getTituloPublicacion());
        publicacion.setUbicacionPublicacion(dto.getUbicacionPublicacion());
        publicacion.setDescripcionPublicacion(dto.getDescripcionPublicacion());
        publicacion.setFechaPublicacion(dto.getFechaPublicacion());
        
        
        // Buscar y setear la Región validando que exista en la base de datos
        if (dto.getIdRegion() != null) {
            Region region = regionRepository.findById(dto.getIdRegion())
                .orElseThrow(() -> new RuntimeException("Región no encontrada con id: " + dto.getIdRegion()));
            publicacion.setRegion(region);
        }
        
        // Buscar y setear la Comuna validando que exista en la base de datos
        if (dto.getIdComuna() != null) {
            Comuna comuna = comunaRepository.findById(dto.getIdComuna())
                .orElseThrow(() -> new RuntimeException("Comuna no encontrada con id: " + dto.getIdComuna()));
            publicacion.setComuna(comuna);
        }

        return publicacion;
    }
}