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
@Table(name = "tipo_contenido_denunciado")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class TipoContenidoDenunciado {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_tipo_contenido")
    private Integer idTipoContenido;

    @Column(name = "nombre_contenido", nullable = false, length = 100)
    private String nombreContenido;
}