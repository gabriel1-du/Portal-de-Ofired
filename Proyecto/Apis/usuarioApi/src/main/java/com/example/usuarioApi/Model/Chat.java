package com.example.usuarioApi.Model;

import java.time.LocalDateTime;
import java.util.List;

import org.hibernate.annotations.CreationTimestamp;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "CHAT")
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class Chat {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_chat")
    private Integer idChat;

    @Column(name = "fecha_creacion", updatable = false)
    @CreationTimestamp
    private LocalDateTime fechaCreacion;

    // Relación bidireccional: Un chat tiene muchos participantes
    @OneToMany(mappedBy = "chat", cascade = CascadeType.ALL, orphanRemoval = true) // Si se borra un chat, se borran sus participantes; si se borra un participante, no afecta al chat
    private List<ParticipanteChat> participantes;

    // Relación bidireccional: Un chat tiene muchos mensajes
    @OneToMany(mappedBy = "chat", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<MensajeChat> mensajes;

}
