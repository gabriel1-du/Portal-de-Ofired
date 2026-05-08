package com.example.publicacionesApi.Model;

import jakarta.persistence.*;

@Entity
@Table(name = "RESPUESTA_RESENIA")
public class RespuestaResenia {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_respuesta_resenia")
    private Integer idRespuestaResenia;

    @ManyToOne
    @JoinColumn(name = "id_resenia", nullable = false)
    private Resenia resenia;

    @Column(name = "id_autor_res", nullable = false)
    private Integer idAutorRes;

    @Column(name = "texto_respuesta_resenia", nullable = false, columnDefinition = "TEXT")
    private String textoRespuestaResenia;

    public Integer getIdRespuestaResenia() { return idRespuestaResenia; }
    public void setIdRespuestaResenia(Integer idRespuestaResenia) { this.idRespuestaResenia = idRespuestaResenia; }

    public Resenia getResenia() { return resenia; }
    public void setResenia(Resenia resenia) { this.resenia = resenia; }

    public Integer getIdAutorRes() { return idAutorRes; }
    public void setIdAutorRes(Integer idAutorRes) { this.idAutorRes = idAutorRes; }

    public String getTextoRespuestaResenia() { return textoRespuestaResenia; }
    public void setTextoRespuestaResenia(String textoRespuestaResenia) { this.textoRespuestaResenia = textoRespuestaResenia; }
}