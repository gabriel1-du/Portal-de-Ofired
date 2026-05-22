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
    private Integer idComentario; 

    @Column(name = "id_publicacion", nullable = false)
    private Integer idPublicacion; 

    // 👇 Esto lo dejamos tal cual para que el POST (guardar) no se rompa
    @Column(name = "id_usuario", nullable = false)
    private Integer idUsuario; 

    // 🌟 EL TRUCO: Agregamos la relación de solo lectura para el GET
    // (insertable y updatable en false evitan que choque con la variable de arriba)
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "id_usuario", insertable = false, updatable = false)
    private Usuario usuario; 

    @Column(name = "contenido", nullable = false, columnDefinition = "TEXT")
    private String contenido;

    @Column(name = "fecha_comentario", insertable = false, updatable = false)
    private LocalDateTime fechaComentario;
}