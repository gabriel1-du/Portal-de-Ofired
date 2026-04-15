package com.example.publicacionesApi.Service;

import com.example.publicacionesApi.Model.FotosPubli;
import java.util.List;

public interface FotosPubliService {
    
    List<FotosPubli> listarPorPublicacion(Integer idPublicacion);
    FotosPubli agregar(FotosPubli fotosPubli);
    void eliminar(Integer id);
}