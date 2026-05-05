package com.example.publicacionesApi.Model;

    import jakarta.persistence.*;
    import lombok.AllArgsConstructor;
    import lombok.Data;
    import lombok.NoArgsConstructor;
    import java.math.BigDecimal;
 

    //A diferencia de la clase modelo en api usuarios, esta solo tiene lo necesario para las reseñas
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

        @Column(name = "correo_elec", nullable = false, unique = true, length = 100)
        private String correoElec;

        @Column(name = "password", nullable = false, length = 255)
        private String password;
     
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
    }