package com.example.usuarioApi.DTO.ClasesTipoTrabajoDTO;

import org.springframework.stereotype.Component;
import com.example.usuarioApi.Model.TipoDeTrabajo;

@Component
public class TipoDeTrabajoMapper {

    public TipoDeTrabajo mapToEntityCrear(CrearTipoDeTrabajoDTO dto) {
        TipoDeTrabajo entity = new TipoDeTrabajo();
        entity.setNombreTipoTrabajo(dto.getNombreTipoTrabajo());
        return entity;
    }

    public LeerTipoDeTrabajoDTO mapToLeerDTO(TipoDeTrabajo entity) {
        if (entity == null) {
            return null;
        }
        LeerTipoDeTrabajoDTO dto = new LeerTipoDeTrabajoDTO();
        dto.setIdTipoTrabajo(entity.getIdTipoTrabajo());
        dto.setNombreTipoTrabajo(entity.getNombreTipoTrabajo());
        return dto;
    }
}
