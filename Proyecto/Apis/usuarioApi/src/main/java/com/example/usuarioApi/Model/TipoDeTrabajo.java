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
@Table(name = "TIPO_DE_TRABAJO")
@NoArgsConstructor
@AllArgsConstructor
@Data
public class TipoDeTrabajo {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_tipo_trabajo")
    private Integer idTipoTrabajo;

    @Column(name = "nombre_tipo_trabajo", nullable = false, length = 100)
    private String nombreTipoTrabajo;


}
