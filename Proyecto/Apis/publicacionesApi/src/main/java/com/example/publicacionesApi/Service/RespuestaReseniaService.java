package com.example.publicacionesApi.Service;

import com.example.publicacionesApi.Model.RespuestaResenia;

public interface RespuestaReseniaService {
    
    RespuestaResenia obtenerPorResenia(Integer idResenia);
    RespuestaResenia crear(RespuestaResenia respuestaResenia);
    void eliminar(Integer id);
}