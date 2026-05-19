package com.example.usuarioApi.DTO.ClasesConfirmacionTransaccionDTO;

import java.math.BigDecimal;
import lombok.Data;

@Data
public class CrearConfirmacionTransaccionDTO {
    private Integer idUsuarioOferente;
    private Integer idUsuarioCliente;
    private BigDecimal montoServicio;
    private Integer idMedioPago;
    private Integer idTipoTrabajo;
    private String observacionesTrato;
    // La fecha y el estado de aceptación son gestionados automáticamente por el sistema
}
