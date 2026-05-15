
package com.example.usuarioApi.Model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "MEDIO_DE_PAGO")
@AllArgsConstructor
@NoArgsConstructor
@Data
public class MedioDePago {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_medio_pago")
    private Integer idMedioPago;

    @Column(name = "nombre_medio_pago", nullable = false, length = 100)
    private String nombreMedioPago;

}
