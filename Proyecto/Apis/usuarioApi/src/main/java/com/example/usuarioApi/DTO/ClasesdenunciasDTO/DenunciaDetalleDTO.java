package com.example.usuarioApi.DTO.ClasesdenunciasDTO;

import java.time.LocalDateTime;

import org.springframework.stereotype.Component;

import lombok.Getter;
import lombok.Setter;

@Component
@Getter
@Setter
public class DenunciaDetalleDTO {

    private Integer idDenuncia;
    private String nombreUsuarioDenunciante; // Reemplaza idUsuarioDenunciante
    private String nombreTipoDenuncia;       // Reemplaza idTipoDenuncia
    private String nombreTipoContenido;      // Reemplaza idTipoContenido
    private String descripcionDenuncia;
    private LocalDateTime fechaDenuncia;
    private String nombreUsuarioDenunciado;  // Reemplaza idUsuarioDenunciado
    
    // Mantener los IDs opcionales por si el Admin quiere hacer clic e ir al recurso
    private Integer idPublicacionDenunciada;
    private Integer idReseniaDenunciada;
    private Integer idRespuestaDenunciada;

}
