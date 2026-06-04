package com.example.publicacionesApi.ServiceImpl;

import com.example.publicacionesApi.Model.Comentario;
import com.example.publicacionesApi.Repository.ComentarioRepository;
import com.example.publicacionesApi.Service.ComentarioService;
import com.example.publicacionesApi.DTO.ComentariosDTO.CrearComentarioDTO;
import com.example.publicacionesApi.DTO.ComentariosDTO.LeerComentarioDTO;
import com.example.publicacionesApi.DTO.ComentariosDTO.ComentarioMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ComentarioServiceImpl implements ComentarioService {

    @Autowired
    private ComentarioRepository comentarioRepository;

    @Autowired
    private ComentarioMapper comentarioMapper;

    @Override
    public LeerComentarioDTO guardarComentario(CrearComentarioDTO comentarioDTO) {
        Comentario comentario = comentarioMapper.toEntity(comentarioDTO);
        Comentario comentarioGuardado = comentarioRepository.save(comentario);
        return comentarioMapper.toDTO(comentarioGuardado);
    }

    @Override
    public List<LeerComentarioDTO> obtenerComentariosPorPublicacion(Integer idPublicacion) {
        return comentarioRepository.findByIdPublicacion(idPublicacion).stream()
                .map(comentarioMapper::toDTO)
                .collect(Collectors.toList());
    }

    @Override
    // CORRECCIÓN: Se cambió Long a Integer para respetar la interfaz
    public void eliminarComentario(Integer idComentario) {
        comentarioRepository.deleteById(idComentario);
    }
}