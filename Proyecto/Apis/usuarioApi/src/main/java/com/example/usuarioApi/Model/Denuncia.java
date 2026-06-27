package com.example.usuarioApi.Model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "denuncias")
public class Denuncia {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_denuncia")
    private Integer idDenuncia;

    @Column(name = "id_usuario_denunciante", nullable = false)
    @OnDelete(action = OnDeleteAction.CASCADE)
    private Integer idUsuarioDenunciante; // El usuario que hace clic en "Reportar"

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_tipo_denuncia", nullable = false)
    private TipoDenuncia tipoDenuncia;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_tipo_contenido", nullable = false)
    private TipoContenidoDenunciado tipoContenido;

    @Column(name = "descripcion_denuncia", columnDefinition = "TEXT", nullable = false)
    private String descripcionDenuncia; // El texto que escriba en el formulario

    @CreationTimestamp
    @Column(name = "fecha_denuncia", updatable = false)
    private LocalDateTime fechaDenuncia;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_usuario_denunciado")
    private Usuario usuarioDenunciado; // El dueño del perfil reportado

    // Estos los dejamos para el futuro por si reportan publicaciones o reseñas
    @Column(name = "id_publicacion_denunciada")
    private Integer idPublicacionDenunciada;

    @Column(name = "id_resenia_denunciada")
    private Integer idReseniaDenunciada;

    @Column(name = "id_respuesta_denunciada")
    private Integer idRespuestaDenunciada;

    // Con @Data de Lombok ya no necesitamos escribir los Getters y Setters a mano :)
}