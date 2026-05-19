package com.example.publicacionesApi.Model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@Entity
@Table(name = "RESPUESTA_COMENTARIO")
public class RespuestaComentario {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_respuesta")
    private Long idRespuesta;

    @Column(name = "id_comentario", nullable = false)
    private Integer idComentario; // Cambiado a Integer para calzar con INT de MySQL

    @Column(name = "id_usuario", nullable = false)
    private Integer idUsuario; // Cambiado a Integer para calzar con INT de MySQL

    @Column(name = "contenido", nullable = false, columnDefinition = "TEXT")
    private String contenido;

    @Column(name = "fecha_respuesta", insertable = false, updatable = false)
    private LocalDateTime fechaRespuesta;
}