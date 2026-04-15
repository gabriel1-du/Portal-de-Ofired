package com.example.publicacionesApi.Model;

import jakarta.persistence.*;

@Entity
@Table(name = "PUBLICACION")
public class Publicacion {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_publicacion")
    private Integer idPublicacion;

    @Column(name = "id_autor", nullable = false)
    private Integer idAutor;

    @Column(name = "titulo_publicacion", nullable = false, length = 150)
    private String tituloPublicacion;

    @ManyToOne
    @JoinColumn(name = "id_region", nullable = false)
    private Region region;

    @ManyToOne
    @JoinColumn(name = "id_comuna", nullable = false)
    private Comuna comuna;

    @Column(name = "ubicacion_publicacion", length = 255)
    private String ubicacionPublicacion;

    @Column(name = "descripcion_publicacion", nullable = false, columnDefinition = "TEXT")
    private String descripcionPublicacion;

    @Column(name = "cantidad_likes")
    private Integer cantidadLikes = 0;

    public Integer getIdPublicacion() { return idPublicacion; }
    public void setIdPublicacion(Integer idPublicacion) { this.idPublicacion = idPublicacion; }

    public Integer getIdAutor() { return idAutor; }
    public void setIdAutor(Integer idAutor) { this.idAutor = idAutor; }

    public String getTituloPublicacion() { return tituloPublicacion; }
    public void setTituloPublicacion(String tituloPublicacion) { this.tituloPublicacion = tituloPublicacion; }

    public Region getRegion() { return region; }
    public void setRegion(Region region) { this.region = region; }

    public Comuna getComuna() { return comuna; }
    public void setComuna(Comuna comuna) { this.comuna = comuna; }

    public String getUbicacionPublicacion() { return ubicacionPublicacion; }
    public void setUbicacionPublicacion(String ubicacionPublicacion) { this.ubicacionPublicacion = ubicacionPublicacion; }

    public String getDescripcionPublicacion() { return descripcionPublicacion; }
    public void setDescripcionPublicacion(String descripcionPublicacion) { this.descripcionPublicacion = descripcionPublicacion; }

    public Integer getCantidadLikes() { return cantidadLikes; }
    public void setCantidadLikes(Integer cantidadLikes) { this.cantidadLikes = cantidadLikes; }
}