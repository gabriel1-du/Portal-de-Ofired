package com.example.usuarioApi.Model;

import jakarta.persistence.Column;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;


@Entity
@Table(name = "PARTICIPANTES_CHAT")
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class ParticipanteChat {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_participantes_chat")
    private Integer idParticipantesChat;

    // Muchos participantes pueden estar en un mismo Chat
    @ManyToOne(fetch = FetchType.LAZY) //Lazy es solo para traer el chat cuando se necesite, no al cargar el participante
    @JoinColumn(name = "id_chat", nullable = false)
    private Chat chat;

    // Muchos registros de participación pueden pertenecer a un mismo Usuario
    @ManyToOne(fetch = FetchType.LAZY) //Lazy es solo para traer el usuario cuando se necesite, no al cargar el participante
    @JoinColumn(name = "id_usuario_participante", nullable = false)
    private Usuario usuario; // Asegúrate de tener tu clase Usuario importada correctamente

}
