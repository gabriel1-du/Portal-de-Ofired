package com.example.usuarioApi.Model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

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
    private Integer idUsuarioDenunciante; // El usuario que hace clic en "Reportar"

    @Column(name = "id_tipo_denuncia")
    private Integer idTipoDenuncia; // Ejemplo: 1 para Fraude, 2 para Acoso, etc.

    @Column(name = "id_tipo_contenido")
    private Integer idTipoContenido; // Ejemplo: 1 para Perfil, 2 para Publicación

    @Column(name = "descripcion_denuncia", columnDefinition = "TEXT")
    private String descripcionDenuncia; // El texto que escriba en el formulario

    @Column(name = "fecha_denuncia")
    private LocalDateTime fechaDenuncia;

    @Column(name = "id_usuario_denunciado")
    private Integer idUsuarioDenunciado; // El dueño del perfil reportado

    // Estos los dejamos para el futuro por si reportan publicaciones o reseñas
    @Column(name = "id_publicacion_denunciada")
    private Integer idPublicacionDenunciada;

    @Column(name = "id_resenia_denunciada")
    private Integer idReseniaDenunciada;

    @Column(name = "id_respuesta_denunciada")
    private Integer idRespuestaDenunciada;

    // Con @Data de Lombok ya no necesitamos escribir los Getters y Setters a mano :)
}