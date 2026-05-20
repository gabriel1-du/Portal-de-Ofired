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
    // CORRECCIÓN: Lo pasamos a Integer para que no choque con las llaves foráneas en MySQL
    private Integer idComentario; 

    @Column(name = "id_publicacion", nullable = false)
    private Integer idPublicacion; 

    @Column(name = "id_usuario", nullable = false)
    private Integer idUsuario; 

    @Column(name = "contenido", nullable = false, columnDefinition = "TEXT")
    private String contenido;

    @Column(name = "fecha_comentario", insertable = false, updatable = false)
    private LocalDateTime fechaComentario;
}