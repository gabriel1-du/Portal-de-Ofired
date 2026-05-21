package com.example.publicacionesApi.ServiceImpl;

import com.example.publicacionesApi.DTO.ClasesPublicacionesDTO.CrearPublicacionDTO;
import com.example.publicacionesApi.DTO.ClasesPublicacionesDTO.leerPublicacionesDTO;
import com.example.publicacionesApi.DTO.ClasesPublicacionesDTO.MapperPublicacionesDTO.CrearPublicacionMapper;
import com.example.publicacionesApi.DTO.ClasesPublicacionesDTO.MapperPublicacionesDTO.LeerPublicacionesMapper;
import com.example.publicacionesApi.Model.Publicacion;
import com.example.publicacionesApi.Repository.PublicacionRepository;
import com.example.publicacionesApi.RestClient.ComunaRestClient;
import com.example.publicacionesApi.RestClient.RegionRestClient;
import com.example.publicacionesApi.Service.PublicacionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
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
    private RegionRestClient regionRestClient;

    @Autowired
    private ComunaRestClient comunaRestClient;

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
        
        // Asignamos la fecha automáticamente desde el backend
        publicacion.setFechaPublicacion(LocalDateTime.now());
        
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
            try {
                regionRestClient.obtenerRegionPorId(publicacionDTO.getIdRegion());
                existente.setIdRegion(publicacionDTO.getIdRegion());
            } catch (Exception e) {
                throw new RuntimeException("Región no encontrada con id: " + publicacionDTO.getIdRegion());
            }
        } else {
            existente.setIdRegion(null);
        }

        if (publicacionDTO.getIdComuna() != null) {
            try {
                comunaRestClient.obtenerComunaPorId(publicacionDTO.getIdComuna());
                existente.setIdComuna(publicacionDTO.getIdComuna());
            } catch (Exception e) {
                throw new RuntimeException("Comuna no encontrada con id: " + publicacionDTO.getIdComuna());
            }
        } else {
            existente.setIdComuna(null);
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
        return publicacionRepository.findByIdRegion(idRegion).stream()
                .map(leerPublicacionesMapper::toDTO)
                .collect(Collectors.toList());
    }

    @Override
    public List<leerPublicacionesDTO> listarPorComuna(Integer idComuna) {
        return publicacionRepository.findByIdComuna(idComuna).stream()
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

    @Override
    public List<leerPublicacionesDTO> buscarPublicaciones(Integer idRegion, Integer idComuna, LocalDateTime fechaPublicacion) {
        List<Publicacion> publicaciones = publicacionRepository.findByFiltros(idRegion, idComuna, fechaPublicacion);
        return publicaciones.stream()
                .map(leerPublicacionesMapper::toDTO)
                .collect(Collectors.toList());
    }
}