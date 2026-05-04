package com.example.publicacionesApi.Service;

import com.example.publicacionesApi.DTO.ClasesReseniasDTO.ActualizarReseniaDTO;
import com.example.publicacionesApi.DTO.ClasesReseniasDTO.CrearReniaDTO;
import com.example.publicacionesApi.DTO.ClasesReseniasDTO.LeerReseniaDTO;
import com.example.publicacionesApi.DTO.ClasesReseniasDTO.LeerReseniaFrontDTO;
import java.util.List;

public interface ReseniaService {
    
    List<LeerReseniaDTO> listarTodas();
    List<LeerReseniaFrontDTO> listarTodasParaFront();
    LeerReseniaDTO obtenerPorId(Integer id);
    LeerReseniaDTO crear(CrearReniaDTO reseniaDTO);
    LeerReseniaDTO actualizar(Integer id, ActualizarReseniaDTO reseniaDTO);
    void eliminar(Integer id);
    List<LeerReseniaFrontDTO> listarPorAutor(Integer idAutor);
    List<LeerReseniaFrontDTO> listarPorUsuarioReseniado(Integer idUsuarioReseniado);
}