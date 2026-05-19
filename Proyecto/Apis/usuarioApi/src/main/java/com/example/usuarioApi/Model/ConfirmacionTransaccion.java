package com.example.usuarioApi.Model;

import java.math.BigDecimal;
import java.sql.Timestamp;

import org.hibernate.annotations.CreationTimestamp;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "CONFIRMACION_TRANSACCION")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ConfirmacionTransaccion {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_transaccion")
    private Integer idTransaccion;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_usuario_oferente", nullable = false)
    private Usuario usuarioOferente;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_usuario_cliente", nullable = false)
    private Usuario usuarioCliente;

    @Column(name = "monto_servicio", nullable = false, precision = 10, scale = 2)
    private BigDecimal montoServicio;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_medio_pago", nullable = false)
    private MedioDePago medioPago;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_tipo_trabajo", nullable = false)
    private TipoDeTrabajo tipoTrabajo;

    @Column(name = "aceptado")
    private Boolean aceptado = true;

    @Column(name = "observaciones_trato", columnDefinition = "TEXT")
    private String observacionesTrato;

    @CreationTimestamp
    @Column(name = "fecha_registro", updatable = false)
    private Timestamp fechaRegistro;
}
