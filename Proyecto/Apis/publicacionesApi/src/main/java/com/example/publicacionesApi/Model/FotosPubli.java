package com.example.publicacionesApi.Model;

import jakarta.persistence.*;

@Entity
@Table(name = "FOTOS_PUBLI")
public class FotosPubli {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_foto_publi")
    private Integer idFotoPubli;

    @ManyToOne
    @JoinColumn(name = "id_publicacion", nullable = false)
    private Publicacion publicacion;

    // 💡 CAMBIO: Cambiamos a columnDefinition = "TEXT" para que soporte links gigantes sin límite de 255
    @Column(name = "url_foto", nullable = false, columnDefinition = "TEXT")
    private String urlFoto;

    public Integer getIdFotoPubli() { return idFotoPubli; }
    public void setIdFotoPubli(Integer idFotoPubli) { this.idFotoPubli = idFotoPubli; }

    public Publicacion getPublicacion() { return publicacion; }
    public void setPublicacion(Publicacion publicacion) { this.publicacion = publicacion; }

    public String getUrlFoto() { return urlFoto; }
    public void setUrlFoto(String urlFoto) { this.urlFoto = urlFoto; }
}