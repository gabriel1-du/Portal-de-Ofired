package com.example.publicacionesApi.Service;

import com.example.publicacionesApi.DTO.ClasesPublicacionesDTO.CrearPublicacionDTO;
import com.example.publicacionesApi.DTO.ClasesPublicacionesDTO.leerPublicacionesDTO;
import com.example.publicacionesApi.Model.Publicacion;
import java.util.List;

public interface PublicacionService {
    
    List<leerPublicacionesDTO> listarTodas();
    leerPublicacionesDTO obtenerPorId(Integer id);
    leerPublicacionesDTO crear(CrearPublicacionDTO publicacionDTO);
    leerPublicacionesDTO actualizar(Integer id, CrearPublicacionDTO publicacionDTO);
    void eliminar(Integer id);
    List<leerPublicacionesDTO> listarPorAutor(Integer idAutor);
    List<leerPublicacionesDTO> listarPorRegion(Integer idRegion);
    List<leerPublicacionesDTO> listarPorComuna(Integer idComuna);
    leerPublicacionesDTO darLike(Integer id);
    List<leerPublicacionesDTO> listarPornombrePublicacion(String nombrePublicacion);
}