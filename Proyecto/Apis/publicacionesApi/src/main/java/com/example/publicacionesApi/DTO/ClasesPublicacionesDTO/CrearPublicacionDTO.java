package com.example.publicacionesApi.DTO.ClasesPublicacionesDTO;

import lombok.AllArgsConstructor;
import java.time.LocalDateTime;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CrearPublicacionDTO {

    private Integer idAutor;
    private String tituloPublicacion;
    private Integer idRegion;
    private Integer idComuna;
    private String ubicacionPublicacion;
    private String descripcionPublicacion;
    private LocalDateTime fechaPublicacion;
    
    // 👇 Agregamos esto para recibir el link de React
    private String imagenUrl; 
}