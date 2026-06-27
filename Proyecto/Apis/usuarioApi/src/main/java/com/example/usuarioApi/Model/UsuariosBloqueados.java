package com.example.usuarioApi.Model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

@Entity
@Table(name = "USUARIOS_BLOQUEADOS")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class UsuariosBloqueados {

   @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_bloqueo")
    private Integer idBloqueo;

    @Column(name = "habilitador", nullable = false)
    private Boolean habilitador = true;

    @Column(name = "fecha_registro", updatable = false)
    @CreationTimestamp
    private LocalDateTime fechaRegistro;

    // Relación 1: El usuario que tomó la decisión de bloquear
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_usuario_que_bloquea", nullable = false)
    @OnDelete(action = OnDeleteAction.CASCADE)
    private Usuario usuarioQueBloquea;

    // Relación 2: El ustuario que recibió el castigo/bloqueo
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_usuario_bloqueado", nullable = false)
    @OnDelete(action = OnDeleteAction.CASCADE)
    private Usuario usuarioBloqueado;
}
