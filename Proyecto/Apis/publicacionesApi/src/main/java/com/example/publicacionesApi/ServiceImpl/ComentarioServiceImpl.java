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
    public List<Comentario> obtenerComentariosPorPublicacion(Integer idPublicacion) {
        return comentarioRepository.findByIdPublicacion(idPublicacion);
    }

    @Override
    // CORRECCIÓN: Se cambió Long a Integer para respetar la interfaz
    public void eliminarComentario(Integer idComentario) {
        comentarioRepository.deleteById(idComentario);
    }
}