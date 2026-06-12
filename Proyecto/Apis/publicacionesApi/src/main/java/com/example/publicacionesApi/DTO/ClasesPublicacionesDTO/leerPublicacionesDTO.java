package com.example.publicacionesApi.DTO.ClasesPublicacionesDTO;

import lombok.AllArgsConstructor;
import java.time.LocalDateTime;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data 
@NoArgsConstructor 
@AllArgsConstructor 
public class leerPublicacionesDTO {

     private Integer idPublicacion;
    private Integer idAutor;
    private String tituloPublicacion;
    
    private Integer idRegion;
    private String nombreRegion;
    
    private Integer idComuna;
    private String nombreComuna;
    
    private String ubicacionPublicacion;
    private String descripcionPublicacion;
    private Integer cantidadLikes;
    private LocalDateTime fechaPublicacion;
    
    // Para la imagen
    private String imagenUrl;

}
