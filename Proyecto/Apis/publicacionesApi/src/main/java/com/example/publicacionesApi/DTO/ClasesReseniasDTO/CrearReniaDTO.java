package com.example.publicacionesApi.DTO.ClasesReseniasDTO;


import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import lombok.Data;

@Data
public class CrearReniaDTO {

    @NotNull(message = "El ID del autor no puede ser nulo.")
    private Integer idAutor;

    @NotNull(message = "El ID del usuario reseñado no puede ser nulo.")
    private Integer idUsuarioReseniado;

    @NotNull(message = "La calificación no puede ser nula.")
    private Double calificacion;

    @NotBlank(message = "El texto de la reseña no puede estar vacío.")
    private String textoResenia;


}
