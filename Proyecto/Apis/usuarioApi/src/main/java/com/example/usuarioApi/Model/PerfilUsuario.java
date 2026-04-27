package com.example.usuarioApi.Model;

import java.math.BigDecimal;
import java.sql.Timestamp;

import org.hibernate.annotations.CreationTimestamp;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Table(name = "PERFIL_USUARIO")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
public class PerfilUsuario {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_perfil_usuario")
    private Integer idPerfilUsuario;

    // Vínculo 1 a 1 estricto con Usuario
    @OneToOne
    @JoinColumn(name = "id_usuario", nullable = false, unique = true)
    private Usuario usuario;

    @Column(name = "nombre_apodo", length = 100)
    private String nombreApodo;

    @Column(name = "p_nombre", length = 50)
    private String pNombre;

    @Column(name = "s_nombre", length = 50)
    private String sNombre;

    @Column(name = "p_apellido", length = 50)
    private String pApellido;

    @Column(name = "s_apellido", length = 50)
    private String sApellido;

    @Column(name = "numero_telefono", length = 20)
    private String numeroTelefono;

    @Column(name = "foto_perfil", length = 255)
    private String fotoPerfil;

    @Column(name = "fotografia_banner", length = 255)
    private String fotografiaBanner;

    @ManyToOne
    @JoinColumn(name = "id_region")
    private Region region;

    @ManyToOne
    @JoinColumn(name = "id_comuna")
    private Comuna comuna;

    @ManyToOne
    @JoinColumn(name = "id_oficio")
    private Oficio oficio;

    @Column(name = "calificacion_p_usuario", precision = 3, scale = 2)
    private BigDecimal calificacionPUsuario;

    @ManyToOne
    @JoinColumn(name = "sexo_usu_per")
    private SexoUsuario sexoUsuario;

    @CreationTimestamp
    @Column(name = "fecha_creacion", updatable = false)
    private Timestamp fechaCreacion;


}
