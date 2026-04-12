package com.example.usuarioApi.Service;

import com.example.usuarioApi.DTO.ClasesOficioDTO.crearOficioDTO;
import com.example.usuarioApi.DTO.ClasesOficioDTO.leerOficioDTO;
import com.example.usuarioApi.Model.Oficio;

import java.util.List;

public interface OficioService {
    //Metodo para cada operacion CRUD
    List<leerOficioDTO> leerTodosLosOficios();
    leerOficioDTO leerOficioPorId(Integer id);
    Oficio crearOficio(crearOficioDTO oficioDTO);
    Oficio actualizarOficio(Integer id, crearOficioDTO oficioDTO);
    void eliminarOficio(Integer id);
}