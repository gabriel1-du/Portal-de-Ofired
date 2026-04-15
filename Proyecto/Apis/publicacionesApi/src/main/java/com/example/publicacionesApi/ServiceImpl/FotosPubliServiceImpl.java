package com.example.publicacionesApi.ServiceImpl;

import com.example.publicacionesApi.Model.FotosPubli;
import com.example.publicacionesApi.Repository.FotosPubliRepository;
import com.example.publicacionesApi.Service.FotosPubliService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class FotosPubliServiceImpl implements FotosPubliService {

    @Autowired
    private FotosPubliRepository fotosPubliRepository;

    @Override
    public List<FotosPubli> listarPorPublicacion(Integer idPublicacion) {
        return fotosPubliRepository.findByPublicacion_IdPublicacion(idPublicacion);
    }

    @Override
    public FotosPubli agregar(FotosPubli fotosPubli) {
        return fotosPubliRepository.save(fotosPubli);
    }

    @Override
    public void eliminar(Integer id) {
        fotosPubliRepository.deleteById(id);
    }
}