package com.example.publicacionesApi.Model;

import jakarta.persistence.*;

@Entity
@Table(name = "OFICIO")
public class Oficio {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_oficio")
    private Integer idOficio;

    @Column(name = "nombre_oficio", nullable = false, length = 100)
    private String nombreOficio;

    public Integer getIdOficio() { return idOficio; }
    public void setIdOficio(Integer idOficio) { this.idOficio = idOficio; }

    public String getNombreOficio() { return nombreOficio; }
    public void setNombreOficio(String nombreOficio) { this.nombreOficio = nombreOficio; }
}