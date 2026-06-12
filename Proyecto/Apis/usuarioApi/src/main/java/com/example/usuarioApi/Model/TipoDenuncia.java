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
@Table(name = "tipo_denuncia")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class TipoDenuncia {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_tipo_denuncia")
    private Integer idTipoDenuncia;

    @Column(name = "nombre_tipo_denuncia", nullable = false, length = 100)
    private String nombreTipoDenuncia;
}