package com.gateway.jwt.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
// Esta tabla debe coincidir con la tabla de usuarios para autenticación en la base de datos del Gateway.
@Table(name = "usuario") 
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Usuario {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_usuario")
    private Integer id;

    @Column(name = "correo_elec", nullable = false, unique = true)
    private String email;

    @Column(name = "password", nullable = false)
    private String contrasena;

    // Este campo es crucial. Determina si el token JWT contendrá el rol "admin" o "user".
    @Column(name = "habilitador_administrador")
    private Boolean admin;

   
}
