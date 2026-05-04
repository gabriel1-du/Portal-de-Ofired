package com.example.publicacionesApi.DTO.ClasesReseniasDTO;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class ActualizarReseniaDTO {

    private Integer idResenia;

    @NotNull(message = "La calificación no puede ser nula.")
    private Double calificacion;

    @NotBlank(message = "El texto de la reseña no puede estar vacío.")
    private String textoResenia;

}
