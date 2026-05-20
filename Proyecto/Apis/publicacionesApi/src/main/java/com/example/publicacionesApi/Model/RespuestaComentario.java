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
    // CORRECCIÓN: Estandarizado a Integer para mantener consistencia en toda la BD
    private Integer idRespuesta;

    @Column(name = "id_comentario", nullable = false)
    private Integer idComentario; 

    @Column(name = "id_usuario", nullable = false)
    private Integer idUsuario; 

    @Column(name = "contenido", nullable = false, columnDefinition = "TEXT")
    private String contenido;

    @Column(name = "fecha_respuesta", insertable = false, updatable = false)
    private LocalDateTime fechaRespuesta;
}