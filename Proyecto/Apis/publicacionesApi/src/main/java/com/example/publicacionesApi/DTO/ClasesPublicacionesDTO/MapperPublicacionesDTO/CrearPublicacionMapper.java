package com.example.publicacionesApi.DTO.ClasesPublicacionesDTO.MapperPublicacionesDTO;

import com.example.publicacionesApi.DTO.ClasesPublicacionesDTO.CrearPublicacionDTO;

import com.example.publicacionesApi.Model.Publicacion;
import com.example.publicacionesApi.RestClient.ComunaRestClient;
import com.example.publicacionesApi.RestClient.RegionRestClient;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import java.time.LocalDateTime;

@Component
public class CrearPublicacionMapper {

    @Autowired
    private RegionRestClient regionRestClient;

    @Autowired
    private ComunaRestClient comunaRestClient;

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
        publicacion.setFechaPublicacion(LocalDateTime.now());
        
        
        // Buscar y setear la Región validando que exista en la base de datos
        if (dto.getIdRegion() != null) {
            try {
                regionRestClient.obtenerRegionPorId(dto.getIdRegion());
                publicacion.setIdRegion(dto.getIdRegion());
            } catch (Exception e) {
                throw new RuntimeException("Región no encontrada con id: " + dto.getIdRegion());
            }
        }
        
        // Buscar y setear la Comuna validando que exista en la base de datos
        if (dto.getIdComuna() != null) {
            try {
                comunaRestClient.obtenerComunaPorId(dto.getIdComuna());
                publicacion.setIdComuna(dto.getIdComuna());
            } catch (Exception e) {
                throw new RuntimeException("Comuna no encontrada con id: " + dto.getIdComuna());
            }
        }

        return publicacion;
    }
}