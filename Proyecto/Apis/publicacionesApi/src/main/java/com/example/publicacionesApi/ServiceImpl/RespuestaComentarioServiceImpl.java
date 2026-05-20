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
    public List<RespuestaComentario> obtenerRespuestasPorComentario(Integer idComentario) {
        return respuestaRepository.findByIdComentario(idComentario);
    }

    @Override
    // CORRECCIÓN: Se cambió Long a Integer para respetar la interfaz
    public void eliminarRespuesta(Integer idRespuesta) {
        respuestaRepository.deleteById(idRespuesta);
    }
}