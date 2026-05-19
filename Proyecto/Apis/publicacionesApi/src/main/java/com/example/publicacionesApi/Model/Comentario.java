package com.example.publicacionesApi.Model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@Entity
@Table(name = "COMENTARIO")
public class Comentario {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_comentario")
    private Long idComentario;

    @Column(name = "id_publicacion", nullable = false)
    private Integer idPublicacion; // Cambiado a Integer para calzar con INT de MySQL

    @Column(name = "id_usuario", nullable = false)
    private Integer idUsuario; // Cambiado a Integer para calzar con INT de MySQL

    @Column(name = "contenido", nullable = false, columnDefinition = "TEXT")
    private String contenido;

    @Column(name = "fecha_comentario", insertable = false, updatable = false)
    private LocalDateTime fechaComentario;
}