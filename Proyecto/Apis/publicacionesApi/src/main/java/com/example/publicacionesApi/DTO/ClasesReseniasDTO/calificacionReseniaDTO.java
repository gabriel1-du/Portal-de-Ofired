package com.example.publicacionesApi.DTO.ClasesReseniasDTO;

public class calificacionReseniaDTO {

    private Integer idUsuario;
    private Double promedioCalificacion;

    public Integer getIdUsuario() {
        return idUsuario;
    }

    public void setIdUsuario(Integer idUsuario) {
        this.idUsuario = idUsuario;
    }

    public Double getPromedioCalificacion() {
        return promedioCalificacion;
    }

    public void setPromedioCalificacion(Double promedioCalificacion) {
        this.promedioCalificacion = promedioCalificacion;
    }
}
