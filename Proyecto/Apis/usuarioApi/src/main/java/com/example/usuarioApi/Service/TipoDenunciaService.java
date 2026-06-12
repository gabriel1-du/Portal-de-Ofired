package com.example.usuarioApi.Service;

import com.example.usuarioApi.Model.TipoDenuncia;
import java.util.List;

public interface TipoDenunciaService {
    TipoDenuncia crear(TipoDenuncia tipoDenuncia);
    TipoDenuncia actualizar(Integer id, TipoDenuncia tipoDenuncia);
    void eliminar(Integer id);
    TipoDenuncia obtenerPorId(Integer id);
    List<TipoDenuncia> obtenerTodos();
}