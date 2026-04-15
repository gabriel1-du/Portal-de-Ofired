package com.example.publicacionesApi.ServiceImpl;

import com.example.publicacionesApi.DTO.ClasesPublicacionesDTO.CrearPublicacionDTO;
import com.example.publicacionesApi.DTO.ClasesPublicacionesDTO.leerPublicacionesDTO;
import com.example.publicacionesApi.DTO.ClasesPublicacionesDTO.MapperPublicacionesDTO.CrearPublicacionMapper;
import com.example.publicacionesApi.DTO.ClasesPublicacionesDTO.MapperPublicacionesDTO.LeerPublicacionesMapper;
import com.example.publicacionesApi.Model.Comuna;
import com.example.publicacionesApi.Model.Publicacion;
import com.example.publicacionesApi.Model.Region;
import com.example.publicacionesApi.Repository.comunaRepository;
import com.example.publicacionesApi.Repository.PublicacionRepository;
import com.example.publicacionesApi.Repository.RegionRepository;
import com.example.publicacionesApi.Service.PublicacionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class PublicacionServiceImpl implements PublicacionService {

    @Autowired
    private PublicacionRepository publicacionRepository;

    @Autowired
    private CrearPublicacionMapper crearPublicacionMapper;

    @Autowired
    private LeerPublicacionesMapper leerPublicacionesMapper;

    @Autowired
    private RegionRepository regionRepository;

    @Autowired
    private comunaRepository comunaRepository;

    @Override
    public List<leerPublicacionesDTO> listarTodas() {
        return publicacionRepository.findAll().stream()
                .map(leerPublicacionesMapper::toDTO)
                .collect(Collectors.toList());
    }

    @Override
    public leerPublicacionesDTO obtenerPorId(Integer id) {
        Publicacion publicacion = publicacionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Publicación no encontrada con id: " + id));
        return leerPublicacionesMapper.toDTO(publicacion);
    }

    @Override
    public leerPublicacionesDTO crear(CrearPublicacionDTO publicacionDTO) {
        Publicacion publicacion = crearPublicacionMapper.crearPublicacionDTOtoPublicacion(publicacionDTO);
        publicacion.setCantidadLikes(0);
        Publicacion publicacionGuardada = publicacionRepository.save(publicacion);
        return leerPublicacionesMapper.toDTO(publicacionGuardada);
    }

    @Override
    public leerPublicacionesDTO actualizar(Integer id, CrearPublicacionDTO publicacionDTO) {
        Publicacion existente = publicacionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Publicación no encontrada con id: " + id));

        existente.setTituloPublicacion(publicacionDTO.getTituloPublicacion());
        existente.setDescripcionPublicacion(publicacionDTO.getDescripcionPublicacion());
        existente.setUbicacionPublicacion(publicacionDTO.getUbicacionPublicacion());

        if (publicacionDTO.getIdRegion() != null) {
            Region region = regionRepository.findById(publicacionDTO.getIdRegion())
                    .orElseThrow(() -> new RuntimeException("Región no encontrada con id: " + publicacionDTO.getIdRegion()));
            existente.setRegion(region);
        } else {
            existente.setRegion(null);
        }

        if (publicacionDTO.getIdComuna() != null) {
            Comuna comuna = comunaRepository.findById(publicacionDTO.getIdComuna())
                    .orElseThrow(() -> new RuntimeException("Comuna no encontrada con id: " + publicacionDTO.getIdComuna()));
            existente.setComuna(comuna);
        } else {
            existente.setComuna(null);
        }

        Publicacion publicacionActualizada = publicacionRepository.save(existente);
        return leerPublicacionesMapper.toDTO(publicacionActualizada);
    }
    
    @Override
    public void eliminar(Integer id) {
        if (!publicacionRepository.existsById(id)) {
            throw new RuntimeException("Publicación no encontrada con id: " + id);
        }
        publicacionRepository.deleteById(id);
    }


    @Override
    public List<leerPublicacionesDTO> listarPorAutor(Integer idAutor) {
        return publicacionRepository.findByIdAutor(idAutor).stream()
                .map(leerPublicacionesMapper::toDTO)
                .collect(Collectors.toList());
    }

    @Override
    public List<leerPublicacionesDTO> listarPorRegion(Integer idRegion) {
        return publicacionRepository.findByRegion_IdRegion(idRegion).stream()
                .map(leerPublicacionesMapper::toDTO)
                .collect(Collectors.toList());
    }

    @Override
    public List<leerPublicacionesDTO> listarPorComuna(Integer idComuna) {
        return publicacionRepository.findByComuna_IdComuna(idComuna).stream()
                .map(leerPublicacionesMapper::toDTO)
                .collect(Collectors.toList());
    }

    @Override
    public leerPublicacionesDTO darLike(Integer id) {
        Publicacion publicacionExistente = publicacionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Publicación no encontrada con id: " + id));
        
        publicacionExistente.setCantidadLikes(publicacionExistente.getCantidadLikes() + 1);
        Publicacion publicacionGuardada = publicacionRepository.save(publicacionExistente);
        return leerPublicacionesMapper.toDTO(publicacionGuardada);
    }

    @Override
    public List<leerPublicacionesDTO> listarPornombrePublicacion(String nombrePublicacion) {
        return publicacionRepository.findByTituloPublicacionContainingIgnoreCase(nombrePublicacion).stream()
                .map(leerPublicacionesMapper::toDTO)
                .collect(Collectors.toList());
    }
}