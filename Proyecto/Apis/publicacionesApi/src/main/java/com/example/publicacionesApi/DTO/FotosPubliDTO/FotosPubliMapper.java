package com.example.publicacionesApi.DTO.FotosPubliDTO;


import com.example.publicacionesApi.Model.FotosPubli;
import com.example.publicacionesApi.Model.Publicacion;
import org.springframework.stereotype.Component;

@Component
public class FotosPubliMapper {

    // Método para crear que recibe el DTO base y el string de la URL
    public FotosPubli toEntity(FotosPubliDTO dto, String urlFoto) {
        if (dto == null) return null;

        FotosPubli fotosPubli = new FotosPubli();
        
        if (dto.getIdPublicacion() != null) {
            Publicacion publicacion = new Publicacion();
            publicacion.setIdPublicacion(dto.getIdPublicacion());
            fotosPubli.setPublicacion(publicacion);
        }
        fotosPubli.setUrlFoto(urlFoto);
        return fotosPubli;
    }

    public FotosPubliDTO toDTO(FotosPubli entity) {
        if (entity == null) return null;
        FotosPubliDTO dto = new FotosPubliDTO();
        dto.setIdFotoPubli(entity.getIdFotoPubli());
        dto.setUrlFoto(entity.getUrlFoto());
        if (entity.getPublicacion() != null) {
            dto.setIdPublicacion(entity.getPublicacion().getIdPublicacion());
        }
        return dto;
    }
}