package com.example.publicacionesApi.ServiceImpl;

import com.example.publicacionesApi.Model.Comentario;
import com.example.publicacionesApi.Repository.ComentarioRepository;
import com.example.publicacionesApi.Service.ComentarioService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class ComentarioServiceImpl implements ComentarioService {

    @Autowired
    private ComentarioRepository comentarioRepository;

    @Override
    public Comentario guardarComentario(Comentario comentario) {
        return comentarioRepository.save(comentario);
    }

    @Override
    public List<Comentario> obtenerComentariosPorPublicacion(Integer idPublicacion) { // Cambiado a Integer para calzar con el Repository
        return comentarioRepository.findByIdPublicacion(idPublicacion);
    }

    @Override
    public void eliminarComentario(Long idComentario) {
        comentarioRepository.deleteById(idComentario);
    }
}