package com.example.publicacionesApi.ServiceImpl;

import com.example.publicacionesApi.DTO.ClasesPublicacionesDTO.CrearPublicacionDTO;
import com.example.publicacionesApi.DTO.ClasesPublicacionesDTO.leerPublicacionesDTO;
import com.example.publicacionesApi.DTO.ClasesPublicacionesDTO.MapperPublicacionesDTO.CrearPublicacionMapper;
import com.example.publicacionesApi.DTO.ClasesPublicacionesDTO.MapperPublicacionesDTO.LeerPublicacionesMapper;
import com.example.publicacionesApi.Model.Publicacion;
import com.example.publicacionesApi.Model.FotosPubli; 
import com.example.publicacionesApi.Repository.PublicacionRepository;
import com.example.publicacionesApi.Repository.FotosPubliRepository; 
import com.example.publicacionesApi.RestClient.ComunaRestClient;
import com.example.publicacionesApi.RestClient.RegionRestClient;
import com.example.publicacionesApi.Service.PublicacionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional; 

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class PublicacionServiceImpl implements PublicacionService {

    @Autowired
    private PublicacionRepository publicacionRepository;

    @Autowired
    private FotosPubliRepository fotosPubliRepository; 

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
                .map(pub -> {
                    leerPublicacionesDTO dto = leerPublicacionesMapper.toDTO(pub);
                    // 👇 Usamos el método exacto de tu repositorio (con el guion bajo)
                    List<FotosPubli> fotos = fotosPubliRepository.findByPublicacion_IdPublicacion(pub.getIdPublicacion());
                    if (fotos != null && !fotos.isEmpty()) {
                        dto.setImagenUrl(fotos.get(0).getUrlFoto()); 
                    }
                    return dto;
                })
                .collect(Collectors.toList());
    }

    @Override
    public leerPublicacionesDTO obtenerPorId(Integer id) {
        Publicacion publicacion = publicacionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Publicación no encontrada con id: " + id));
        
        leerPublicacionesDTO dto = leerPublicacionesMapper.toDTO(publicacion);
        // 👇 Usamos el método exacto de tu repositorio (con el guion bajo)
        List<FotosPubli> fotos = fotosPubliRepository.findByPublicacion_IdPublicacion(id);
        if (fotos != null && !fotos.isEmpty()) {
            dto.setImagenUrl(fotos.get(0).getUrlFoto());
        }
        
        return dto;
    }

    @Override
    @Transactional 
    public leerPublicacionesDTO crear(CrearPublicacionDTO publicacionDTO) {
        Publicacion publicacion = crearPublicacionMapper.crearPublicacionDTOtoPublicacion(publicacionDTO);
        publicacion.setCantidadLikes(0);
        publicacion.setFechaPublicacion(LocalDateTime.now());
        
        // 1. Guardamos la Publicación
        Publicacion publicacionGuardada = publicacionRepository.save(publicacion);
        
        // 2. Si vino un link de imagen, lo guardamos en la tabla FOTOS_PUBLI
        String urlAsignada = null;
        if (publicacionDTO.getImagenUrl() != null && !publicacionDTO.getImagenUrl().trim().isEmpty()) {
            FotosPubli foto = new FotosPubli();
            foto.setPublicacion(publicacionGuardada);
            foto.setUrlFoto(publicacionDTO.getImagenUrl());
            fotosPubliRepository.save(foto);
            urlAsignada = publicacionDTO.getImagenUrl();
        }
        
        // 3. Preparamos el DTO de respuesta
        leerPublicacionesDTO dtoRespuesta = leerPublicacionesMapper.toDTO(publicacionGuardada);
        dtoRespuesta.setImagenUrl(urlAsignada);
        
        return dtoRespuesta;
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