package com.example.usuarioApi.ServiceImpl;

import com.example.usuarioApi.Model.TipoDenuncia;
import com.example.usuarioApi.Repository.TipoDenunciaRepository;
import com.example.usuarioApi.Service.TipoDenunciaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TipoDenunciaServiceImpl implements TipoDenunciaService {

    @Autowired
    private TipoDenunciaRepository repository;

    @Override
    public TipoDenuncia crear(TipoDenuncia tipoDenuncia) {
        return repository.save(tipoDenuncia);
    }

    @Override
    public TipoDenuncia actualizar(Integer id, TipoDenuncia tipoDenuncia) {
        TipoDenuncia existente = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Tipo de Denuncia no encontrado con id: " + id));
        existente.setNombreTipoDenuncia(tipoDenuncia.getNombreTipoDenuncia());
        return repository.save(existente);
    }

    @Override
    public void eliminar(Integer id) {
        repository.deleteById(id);
    }

    @Override
    public TipoDenuncia obtenerPorId(Integer id) {
        return repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Tipo de Denuncia no encontrado con id: " + id));
    }

    @Override
    public List<TipoDenuncia> obtenerTodos() {
        return repository.findAll();
    }
}