package com.example.publicacionesApi.DTO.ClasesPublicacionesDTO.MapperPublicacionesDTO;

import com.example.publicacionesApi.DTO.ClasesPublicacionesDTO.leerPublicacionesDTO;
import com.example.publicacionesApi.Model.Publicacion;
import com.example.publicacionesApi.RestClient.ComunaRestClient;
import com.example.publicacionesApi.RestClient.RegionRestClient;
import com.example.publicacionesApi.RestClientDTO.ComunaExternoDTO;
import com.example.publicacionesApi.RestClientDTO.RegionExternoDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
public class LeerPublicacionesMapper {

    @Autowired
    private RegionRestClient regionRestClient;

    @Autowired
    private ComunaRestClient comunaRestClient;

    //Metodo que se usa para convertir una entidad Publicacion a un leerPublicacionesDTO, extrayendo los datos de las relaciones con Región y Comuna
    public leerPublicacionesDTO toDTO(Publicacion publicacion) {
        if (publicacion == null) {
            return null;
        }

        leerPublicacionesDTO dto = new leerPublicacionesDTO();
        dto.setIdPublicacion(publicacion.getIdPublicacion());
        dto.setIdAutor(publicacion.getIdAutor());
        dto.setTituloPublicacion(publicacion.getTituloPublicacion());
        
        // Extrayendo los datos de la relación con Región
        if (publicacion.getIdRegion() != null) {
            dto.setIdRegion(publicacion.getIdRegion());
            try {
                RegionExternoDTO region = regionRestClient.obtenerRegionPorId(publicacion.getIdRegion());
                dto.setNombreRegion(region.getNombreRegion());
            } catch (Exception e) {
                dto.setNombreRegion("Región no encontrada");
            }
        }
        
        // Extrayendo los datos de la relación con Comuna
        if (publicacion.getIdComuna() != null) {
            dto.setIdComuna(publicacion.getIdComuna());
            try {
                ComunaExternoDTO comuna = comunaRestClient.obtenerComunaPorId(publicacion.getIdComuna());
                dto.setNombreComuna(comuna.getNombreComuna());
            } catch (Exception e) {
                dto.setNombreComuna("Comuna no encontrada");
            }
        }
        
        dto.setUbicacionPublicacion(publicacion.getUbicacionPublicacion());
        dto.setDescripcionPublicacion(publicacion.getDescripcionPublicacion());
        dto.setCantidadLikes(publicacion.getCantidadLikes());
        dto.setFechaPublicacion(publicacion.getFechaPublicacion());
      
        
        return dto;
    }
}