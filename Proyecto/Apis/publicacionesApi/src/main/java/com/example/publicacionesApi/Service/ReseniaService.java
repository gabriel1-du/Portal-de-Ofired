package com.example.publicacionesApi.Service;

import com.example.publicacionesApi.Model.Resenia;
import java.util.List;

public interface ReseniaService {
    
    List<Resenia> listarTodas();
    Resenia obtenerPorId(Integer id);
    Resenia crear(Resenia resenia);
    void eliminar(Integer id);
    List<Resenia> listarPorAutor(Integer idAutor);
    List<Resenia> listarPorUsuarioReseniado(Integer idUsuarioReseniado);
}