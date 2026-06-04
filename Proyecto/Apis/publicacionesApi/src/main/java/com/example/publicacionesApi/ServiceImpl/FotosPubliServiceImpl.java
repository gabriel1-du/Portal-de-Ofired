package com.example.publicacionesApi.ServiceImpl;

import com.example.publicacionesApi.Model.FotosPubli;
import com.example.publicacionesApi.Repository.FotosPubliRepository;
import com.example.publicacionesApi.Service.FotosPubliService;
import com.example.publicacionesApi.Minio.MinioStorageService;
import com.example.publicacionesApi.DTO.FotosPubliDTO.FotosPubliDTO;
import com.example.publicacionesApi.DTO.FotosPubliDTO.FotosPubliMapper;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class FotosPubliServiceImpl implements FotosPubliService {

    @Autowired
    private FotosPubliRepository fotosPubliRepository;

    @Autowired
    private MinioStorageService minioStorageService;

    @Autowired
    private FotosPubliMapper fotosPubliMapper;

    @Override
    public List<FotosPubliDTO> listarPorPublicacion(Integer idPublicacion) {
        return fotosPubliRepository.findByPublicacion_IdPublicacion(idPublicacion)
                .stream()
                .map(fotosPubliMapper::toDTO)
                .collect(Collectors.toList());
    }

    @Override
    public FotosPubliDTO agregar(FotosPubliDTO fotosPubliDTO, MultipartFile archivoFoto) {
        String urlFoto = null;
        if (archivoFoto != null && !archivoFoto.isEmpty()) {
            try {
                urlFoto = minioStorageService.subirArchivo(archivoFoto);
            } catch (IOException e) {
                throw new RuntimeException("Error al subir la foto a MinIO: " + e.getMessage());
            }
        }

        FotosPubli fotosPubli = fotosPubliMapper.toEntity(fotosPubliDTO, urlFoto);
        FotosPubli fotoGuardada = fotosPubliRepository.save(fotosPubli);
        return fotosPubliMapper.toDTO(fotoGuardada);
    }

    @Override
    public void eliminar(Integer id) {
        fotosPubliRepository.deleteById(id);
    }
}