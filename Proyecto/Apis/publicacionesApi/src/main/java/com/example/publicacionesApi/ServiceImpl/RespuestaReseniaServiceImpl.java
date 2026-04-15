package com.example.publicacionesApi.ServiceImpl;

import com.example.publicacionesApi.Model.RespuestaResenia;
import com.example.publicacionesApi.Repository.RespuestaReseniaRepository;
import com.example.publicacionesApi.Service.RespuestaReseniaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class RespuestaReseniaServiceImpl implements RespuestaReseniaService {

    @Autowired
    private RespuestaReseniaRepository respuestaReseniaRepository;

    @Override
    public RespuestaResenia obtenerPorResenia(Integer idResenia) {
        return respuestaReseniaRepository.findByResenia_IdResenia(idResenia)
                .orElseThrow(() -> new RuntimeException("Respuesta no encontrada para la reseña con id: " + idResenia));
    }

    @Override
    public RespuestaResenia crear(RespuestaResenia respuestaResenia) {
        boolean yaExiste = respuestaReseniaRepository
                .existsByResenia_IdResenia(respuestaResenia.getResenia().getIdResenia());
        if (yaExiste) {
            throw new RuntimeException("Ya existe una respuesta para esta reseña");
        }
        return respuestaReseniaRepository.save(respuestaResenia);
    }

    @Override
    public void eliminar(Integer id) {
        respuestaReseniaRepository.deleteById(id);
    }
}
