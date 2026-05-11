package com.example.usuarioApi.Model;

import java.time.LocalDateTime;

import org.hibernate.annotations.CreationTimestamp;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;


@Entity
@Table(name = "MENSAJES_CHAT")
@NoArgsConstructor
@AllArgsConstructor
public class MensajeChat {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_mensaje_chat")
    private Integer idMensajeChat;

    @Column(name = "mensaje_texto", columnDefinition = "TEXT", nullable = false)
    private String mensajeTexto;

    @Column(name = "fecha_hora_envio", updatable = false)
    @CreationTimestamp
    private LocalDateTime fechaHoraEnvio;

    // Muchos mensajes pertenecen a una sola sala de Chat
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_chat", nullable = false)
    private Chat chat;

    // Muchos mensajes pueden ser escritos por un mismo Usuario (Autor)
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_autor_mensaje", nullable = false)
    private Usuario autor;

}
