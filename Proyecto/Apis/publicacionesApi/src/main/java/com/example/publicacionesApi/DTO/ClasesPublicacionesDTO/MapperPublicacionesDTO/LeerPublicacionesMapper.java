package com.example.publicacionesApi.DTO.ClasesPublicacionesDTO.MapperPublicacionesDTO;

import com.example.publicacionesApi.DTO.ClasesPublicacionesDTO.leerPublicacionesDTO;
import com.example.publicacionesApi.Model.Publicacion;
import org.springframework.stereotype.Component;

@Component
public class LeerPublicacionesMapper {

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
        if (publicacion.getRegion() != null) {
            dto.setIdRegion(publicacion.getRegion().getIdRegion());
            dto.setNombreRegion(publicacion.getRegion().getNombreRegion());
        }
        
        // Extrayendo los datos de la relación con Comuna
        if (publicacion.getComuna() != null) {
            dto.setIdComuna(publicacion.getComuna().getIdComuna());
            dto.setNombreComuna(publicacion.getComuna().getNombreComuna());
        }
        
        dto.setUbicacionPublicacion(publicacion.getUbicacionPublicacion());
        dto.setDescripcionPublicacion(publicacion.getDescripcionPublicacion());
        dto.setCantidadLikes(publicacion.getCantidadLikes());
        
        return dto;
    }
}