package com.example.usuarioApi.Service;


import com.example.usuarioApi.DTO.ClasesdenunciasDTO.CrearDenunciaDTO;
import com.example.usuarioApi.DTO.ClasesdenunciasDTO.DenunciaDetalleDTO;
import com.example.usuarioApi.Model.Denuncia;
import java.util.List;

public interface DenunciaService {
    //Metodo post
    Denuncia registrarDenuncia(CrearDenunciaDTO dto);
    //Metodos get
    DenunciaDetalleDTO obtenerDetallePorId(Integer id);
    List<DenunciaDetalleDTO> listarTodasDetalle();
    //Metodo delete
    void eliminarDenuncia(Integer id);
    
}