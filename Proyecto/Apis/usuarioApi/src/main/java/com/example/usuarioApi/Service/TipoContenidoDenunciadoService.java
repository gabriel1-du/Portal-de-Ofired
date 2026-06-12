package com.example.usuarioApi.Service;

import com.example.usuarioApi.Model.TipoContenidoDenunciado;
import java.util.List;

public interface TipoContenidoDenunciadoService {
    TipoContenidoDenunciado crear(TipoContenidoDenunciado tipoContenidoDenunciado);
    TipoContenidoDenunciado actualizar(Integer id, TipoContenidoDenunciado tipoContenidoDenunciado);
    void eliminar(Integer id);
    TipoContenidoDenunciado obtenerPorId(Integer id);
    List<TipoContenidoDenunciado> obtenerTodos();
}