package com.example.publicacionesApi.ServiceImpl;

import com.example.publicacionesApi.Model.RespuestaComentario;
import com.example.publicacionesApi.Repository.RespuestaComentarioRepository;
import com.example.publicacionesApi.Service.RespuestaComentarioService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class RespuestaComentarioServiceImpl implements RespuestaComentarioService {

    @Autowired
    private RespuestaComentarioRepository respuestaRepository;

    @Override
    public RespuestaComentario guardarRespuesta(RespuestaComentario respuesta) {
        return respuestaRepository.save(respuesta);
    }

    @Override
    public List<RespuestaComentario> obtenerRespuestasPorComentario(Integer idComentario) { // Cambiado a Integer para calzar con el Repository
        return respuestaRepository.findByIdComentario(idComentario);
    }

    @Override
    public void eliminarRespuesta(Long idRespuesta) {
        respuestaRepository.deleteById(idRespuesta);
    }
}