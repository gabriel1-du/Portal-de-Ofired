package com.example.usuarioApi.DTO.ClasesMedioDePagoDTO;

import org.springframework.stereotype.Component;
import com.example.usuarioApi.Model.MedioDePago;

@Component
public class MedioDePagoMapper {

    public MedioDePago mapToEntityCrear(CrearMedioDePagoDTO dto) {
        MedioDePago entity = new MedioDePago();
        entity.setNombreMedioPago(dto.getNombreMedioPago());
        return entity;
    }

    public LeerMedioDePagoDTO mapToLeerDTO(MedioDePago entity) {
        if (entity == null) {
            return null;
        }
        LeerMedioDePagoDTO dto = new LeerMedioDePagoDTO();
        dto.setIdMedioPago(entity.getIdMedioPago());
        dto.setNombreMedioPago(entity.getNombreMedioPago());
        return dto;
    }
}
