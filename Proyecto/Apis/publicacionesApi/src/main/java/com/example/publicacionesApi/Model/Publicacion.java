package com.example.publicacionesApi.Model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "PUBLICACION")
@AllArgsConstructor
@NoArgsConstructor
public class Publicacion {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_publicacion")
    private Integer idPublicacion;

    @Column(name = "id_autor", nullable = false)
    private Integer idAutor;

    @Column(name = "titulo_publicacion", nullable = false, length = 150)
    private String tituloPublicacion;

    @Column(name = "id_region", nullable = false)
    private Integer idRegion;// A travez de regionRestClient se setteara la region

    @Column(name = "id_comuna", nullable = false)
    private Integer idComuna; //A travez de comunaRestClient se setteara la comuna

    @Column(name = "ubicacion_publicacion", length = 255)
    private String ubicacionPublicacion;

    @Column(name = "descripcion_publicacion", nullable = false, columnDefinition = "TEXT")
    private String descripcionPublicacion;

    @Column(name = "cantidad_likes")
    private Integer cantidadLikes = 0;

    @Column(name = "fecha_publicacion", columnDefinition = "TIMESTAMP DEFAULT CURRENT_TIMESTAMP")
    private LocalDateTime fechaPublicacion;

  
}