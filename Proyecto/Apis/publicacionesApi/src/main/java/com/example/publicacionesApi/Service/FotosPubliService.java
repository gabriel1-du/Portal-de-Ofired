package com.example.publicacionesApi.Service;

import com.example.publicacionesApi.DTO.FotosPubliDTO.FotosPubliDTO;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public interface FotosPubliService {
    
    List<FotosPubliDTO> listarPorPublicacion(Integer idPublicacion);
    FotosPubliDTO agregar(FotosPubliDTO fotosPubliDTO, MultipartFile archivoFoto);
    void eliminar(Integer id);
}