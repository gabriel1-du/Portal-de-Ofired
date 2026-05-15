package com.example.usuarioApi.DTO.ClasesConfirmacionTransaccionDTO;

import java.sql.Timestamp;
import java.time.Instant;

import org.springframework.stereotype.Component;

import com.example.usuarioApi.Model.ConfirmacionTransaccion;
import com.example.usuarioApi.Model.MedioDePago;
import com.example.usuarioApi.Model.TipoDeTrabajo;
import com.example.usuarioApi.Model.Usuario;

@Component
public class ConfirmacionTransaccionMapper {

    public ConfirmacionTransaccion mapToEntityCrear(CrearConfirmacionTransaccionDTO dto, Usuario oferente, Usuario cliente, MedioDePago medioPago, TipoDeTrabajo tipoTrabajo) {
        ConfirmacionTransaccion entity = new ConfirmacionTransaccion();
        entity.setUsuarioOferente(oferente);
        entity.setUsuarioCliente(cliente);
        entity.setMontoServicio(dto.getMontoServicio());
        entity.setMedioPago(medioPago);
        entity.setTipoTrabajo(tipoTrabajo);
        entity.setObservacionesTrato(dto.getObservacionesTrato());
        entity.setAceptado(false);
        entity.setFechaRegistro(Timestamp.from(Instant.now()));
        return entity;
    }

    public LeerConfirmacionTransaccionDTO mapToLeerIdDTO(ConfirmacionTransaccion entity) {
        LeerConfirmacionTransaccionDTO dto = new LeerConfirmacionTransaccionDTO();
        dto.setIdTransaccion(entity.getIdTransaccion());
        dto.setIdUsuarioOferente(entity.getUsuarioOferente().getIdUsuario());
        dto.setIdUsuarioCliente(entity.getUsuarioCliente().getIdUsuario());
        dto.setMontoServicio(entity.getMontoServicio());
        dto.setIdMedioPago(entity.getMedioPago().getIdMedioPago());
        dto.setIdTipoTrabajo(entity.getTipoTrabajo().getIdTipoTrabajo());
        dto.setAceptado(entity.getAceptado());
        dto.setObservacionesTrato(entity.getObservacionesTrato());
        dto.setFechaRegistro(entity.getFechaRegistro());
        return dto;
    }

    public LeerConfirmacionTransaccionFrontDTO mapToLeerFrontDTO(ConfirmacionTransaccion entity) {
        LeerConfirmacionTransaccionFrontDTO dto = new LeerConfirmacionTransaccionFrontDTO();
        dto.setIdTransaccion(entity.getIdTransaccion());
        dto.setIdUsuarioOferente(entity.getUsuarioOferente().getIdUsuario());
        dto.setNombreUsuarioOferente(entity.getUsuarioOferente().getPNombre() + " " + entity.getUsuarioOferente().getPApellido());
        dto.setIdUsuarioCliente(entity.getUsuarioCliente().getIdUsuario());
        dto.setNombreUsuarioCliente(entity.getUsuarioCliente().getPNombre() + " " + entity.getUsuarioCliente().getPApellido());
        dto.setMontoServicio(entity.getMontoServicio());
        dto.setIdMedioPago(entity.getMedioPago().getIdMedioPago());
        dto.setNombreMedioPago(entity.getMedioPago().getNombreMedioPago());
        dto.setIdTipoTrabajo(entity.getTipoTrabajo().getIdTipoTrabajo());
        dto.setNombreTipoTrabajo(entity.getTipoTrabajo().getNombreTipoTrabajo());
        dto.setAceptado(entity.getAceptado());
        dto.setObservacionesTrato(entity.getObservacionesTrato());
        dto.setFechaRegistro(entity.getFechaRegistro());
        return dto;
    }
}
