package com.example.usuarioApi.DTO.ClasesdenunciasDTO;

import java.time.LocalDateTime;

import lombok.Data;
import lombok.Getter;
import lombok.Setter;

@Data
@Getter
@Setter
public class DenunciaDTO {

    private Integer idDenuncia;
    private Integer idUsuarioDenunciante;
    private Integer idTipoDenuncia;
    private String nombreTipoDenuncia;
    private Integer idTipoContenido;
    private String nombreContenido;
    private String descripcionDenuncia;
    private LocalDateTime fechaDenuncia;
    private Integer idUsuarioDenunciado;
    private Integer idPublicacionDenunciada;
    private Integer idReseniaDenunciada;
    private Integer idRespuestaDenunciada;

}
