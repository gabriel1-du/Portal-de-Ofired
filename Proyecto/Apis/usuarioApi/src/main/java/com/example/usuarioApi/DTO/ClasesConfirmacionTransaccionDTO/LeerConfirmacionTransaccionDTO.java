package com.example.usuarioApi.DTO.ClasesConfirmacionTransaccionDTO;

import java.math.BigDecimal;
import java.sql.Timestamp;
import lombok.Data;

@Data
public class LeerConfirmacionTransaccionDTO {
    private Integer idTransaccion;
    private Integer idUsuarioOferente;
    private Integer idUsuarioCliente;
    private BigDecimal montoServicio;
    private Integer idMedioPago;
    private Integer idTipoTrabajo;
    private Boolean aceptado;
    private String observacionesTrato;
    private Timestamp fechaRegistro;
}
