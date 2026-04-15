package com.example.publicacionesApi.Model;

import jakarta.persistence.*;

@Entity
@Table(name = "COMUNA")
public class Comuna {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_comuna")
    private Integer idComuna;

    @ManyToOne
    @JoinColumn(name = "id_region", nullable = false)
    private Region region;

    @Column(name = "nombre_comuna", nullable = false, length = 100)
    private String nombreComuna;

    public Integer getIdComuna() { return idComuna; }
    public void setIdComuna(Integer idComuna) { this.idComuna = idComuna; }

    public Region getRegion() { return region; }
    public void setRegion(Region region) { this.region = region; }

    public String getNombreComuna() { return nombreComuna; }
    public void setNombreComuna(String nombreComuna) { this.nombreComuna = nombreComuna; }
}