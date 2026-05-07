package com.example.publicacionesApi.Service;

import com.example.publicacionesApi.DTO.ClasesRespuestasReseniasDTO.RespuestaReseniaDTO;
import com.example.publicacionesApi.DTO.ClasesRespuestasReseniasDTO.RespuestaReseniaFrontDTO;
import com.example.publicacionesApi.DTO.ClasesRespuestasReseniasDTO.actualizarRespuestaReseniaDTO;
import com.example.publicacionesApi.DTO.ClasesRespuestasReseniasDTO.crearRespuestaReseniaDTO;

public interface RespuestaReseniaService {
    
    RespuestaReseniaDTO obtenerPorResenia(Integer idResenia);
    RespuestaReseniaFrontDTO obtenerPorReseniaFront(Integer idResenia);
    RespuestaReseniaDTO crear(crearRespuestaReseniaDTO respuestaReseniaDTO);
    RespuestaReseniaDTO actualizar(Integer id, actualizarRespuestaReseniaDTO respuestaReseniaDTO);
    void eliminar(Integer id);
}