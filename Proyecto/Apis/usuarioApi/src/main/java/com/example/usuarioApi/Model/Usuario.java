package com.example.usuarioApi.Model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;
import java.sql.Timestamp;

@Entity
@Table(name = "USUARIO")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Usuario {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_usuario")
    private Integer idUsuario;

    @Column(name = "p_nombre", nullable = false, length = 50)
    private String pNombre;

    @Column(name = "s_nombre", length = 50)
    private String sNombre;

    @Column(name = "p_apellido", nullable = false, length = 50)
    private String pApellido;

    @Column(name = "s_apellido", length = 50)
    private String sApellido;

    @ManyToOne
    @JoinColumn(name = "id_sexo_usu", nullable = false)
    private SexoUsuario sexo;

    @Column(name = "correo_elec", nullable = false, unique = true, length = 100)
    private String correoElec;

    @Column(name = "password", nullable = false, length = 255)
    private String password;

    @ManyToOne
    @JoinColumn(name = "id_tipo_usu", nullable = false)
    private TipoUsuario tipoUsuario;

    @Column(name = "rut", unique = true, length = 12)
    private String rut;

    @Column(name = "rut_dv", length = 1)
    private String rutDv;

    @Column(name = "numero_telef", length = 20)
    private String numeroTelef;

    @Column(name = "fecha_creacion")
    private Timestamp fechaCreacion;

    @Column(name = "foto", length = 255)
    private String foto;

    @Column(name = "valoracion", precision = 3, scale = 2)
    private BigDecimal valoracion;

    @ManyToOne
    @JoinColumn(name = "id_region_usu")
    private Region region;

    @ManyToOne
    @JoinColumn(name = "id_comuna_usu")
    private Comuna comuna;

    @Column(name = "habilitador_administrador")
    private Boolean habilitadorAdministrador;

    @ManyToOne
    @JoinColumn(name = "id_oficio")
    private Oficio oficio;
}