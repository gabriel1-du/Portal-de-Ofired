package com.example.usuarioApi.DTO.ClasesConfirmacionTransaccionDTO;

import java.math.BigDecimal;
import java.sql.Timestamp;
import lombok.Data;

@Data
public class LeerConfirmacionTransaccionFrontDTO {
    private Integer idTransaccion;
    private Integer idUsuarioOferente;
    private String nombreUsuarioOferente;
    private Integer idUsuarioCliente;
    private String nombreUsuarioCliente;
    private BigDecimal montoServicio;
    private Integer idMedioPago;
    private String nombreMedioPago;
    private Integer idTipoTrabajo;
    private String nombreTipoTrabajo;
    private Boolean aceptado;
    private String observacionesTrato;
    private Timestamp fechaRegistro;
}
