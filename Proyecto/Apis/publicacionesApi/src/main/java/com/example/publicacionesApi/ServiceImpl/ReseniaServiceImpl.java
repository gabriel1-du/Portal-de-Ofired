package com.example.publicacionesApi.ServiceImpl;

import com.example.publicacionesApi.Model.Resenia;
import com.example.publicacionesApi.Repository.ReseniaRepository;
import com.example.publicacionesApi.Service.ReseniaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class ReseniaServiceImpl implements ReseniaService {

    @Autowired
    private ReseniaRepository reseniaRepository;

    @Override
    public List<Resenia> listarTodas() {
        return reseniaRepository.findAll();
    }

    @Override
    public Resenia obtenerPorId(Integer id) {
        return reseniaRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Reseña no encontrada con id: " + id));
    }

    @Override
    public Resenia crear(Resenia resenia) {
        return reseniaRepository.save(resenia);
    }

    @Override
    public void eliminar(Integer id) {
        obtenerPorId(id);
        reseniaRepository.deleteById(id);
    }

    @Override
    public List<Resenia> listarPorAutor(Integer idAutor) {
        return reseniaRepository.findByIdAutor(idAutor);
    }

    @Override
    public List<Resenia> listarPorUsuarioReseniado(Integer idUsuarioReseniado) {
        return reseniaRepository.findByIdUsuarioReseniado(idUsuarioReseniado);
    }
}