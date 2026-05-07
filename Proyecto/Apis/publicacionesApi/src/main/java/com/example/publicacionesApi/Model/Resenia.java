package com.example.publicacionesApi.Model;

import jakarta.persistence.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "RESENIA")
public class Resenia {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_resenia")
    private Integer idResenia;

    @Column(name = "id_autor", nullable = false)
    private Integer idAutor;

    @Column(name = "id_usuario_reseniado", nullable = false)
    private Integer idUsuarioReseniado;

    @Column(name = "calificacion", nullable = false)
    private Double calificacion;

    @Column(name = "texto_resenia", nullable = false, columnDefinition = "TEXT")
    private String textoResenia;

    @Column(name = "fecha_creacion", columnDefinition = "TIMESTAMP DEFAULT CURRENT_TIMESTAMP")
    private LocalDateTime fechaCreacion;

    public Integer getIdResenia() { return idResenia; }
    public void setIdResenia(Integer idResenia) { this.idResenia = idResenia; }

    public Integer getIdAutor() { return idAutor; }
    public void setIdAutor(Integer idAutor) { this.idAutor = idAutor; }

    public Integer getIdUsuarioReseniado() { return idUsuarioReseniado; }
    public void setIdUsuarioReseniado(Integer idUsuarioReseniado) { this.idUsuarioReseniado = idUsuarioReseniado; }

    public Double getCalificacion() { return calificacion; }
    public void setCalificacion(Double calificacion) { this.calificacion = calificacion; }

    public String getTextoResenia() { return textoResenia; }
    public void setTextoResenia(String textoResenia) { this.textoResenia = textoResenia; }

    public LocalDateTime getFechaCreacion() { return fechaCreacion; }
    public void setFechaCreacion(LocalDateTime fechaCreacion) { this.fechaCreacion = fechaCreacion; }
}