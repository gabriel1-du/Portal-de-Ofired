package com.example.usuarioApi.ServiceImpl;

import com.example.usuarioApi.Model.TipoContenidoDenunciado;
import com.example.usuarioApi.Repository.TipoContenidoDenunciadoRepository;
import com.example.usuarioApi.Service.TipoContenidoDenunciadoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TipoContenidoDenunciadoServiceImpl implements TipoContenidoDenunciadoService {

    @Autowired
    private TipoContenidoDenunciadoRepository repository;

    @Override
    public TipoContenidoDenunciado crear(TipoContenidoDenunciado tipoContenidoDenunciado) {
        return repository.save(tipoContenidoDenunciado);
    }

    @Override
    public TipoContenidoDenunciado actualizar(Integer id, TipoContenidoDenunciado tipoContenidoDenunciado) {
        TipoContenidoDenunciado existente = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Tipo de Contenido no encontrado con id: " + id));
        existente.setNombreContenido(tipoContenidoDenunciado.getNombreContenido());
        return repository.save(existente);
    }

    @Override
    public void eliminar(Integer id) {
        repository.deleteById(id);
    }

    @Override
    public TipoContenidoDenunciado obtenerPorId(Integer id) {
        return repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Tipo de Contenido no encontrado con id: " + id));
    }

    @Override
    public List<TipoContenidoDenunciado> obtenerTodos() {
        return repository.findAll();
    }
}