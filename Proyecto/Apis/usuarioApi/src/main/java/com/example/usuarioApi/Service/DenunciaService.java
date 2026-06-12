package com.example.usuarioApi.Service;

import com.example.usuarioApi.DTO.ClasesDenunciaDTO.CrearDenunciaDTO;
import com.example.usuarioApi.Model.Denuncia;
import java.util.List;

public interface DenunciaService {
    
    Denuncia registrarDenuncia(Integer idUsuarioDenunciante, CrearDenunciaDTO dto);
    
    List<Denuncia> listarTodas();
    
}