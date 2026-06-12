package com.example.usuarioApi.ServiceImpl; // <-- Apunta a tu carpeta actual

// 👇 Estos dos imports eran los que te faltaban
import com.example.usuarioApi.Service.DenunciaService;
import com.example.usuarioApi.DTO.ClasesDenunciaDTO.CrearDenunciaDTO;

import com.example.usuarioApi.Model.Denuncia;
import com.example.usuarioApi.Repository.DenunciaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class DenunciaServiceImpl implements DenunciaService {

    @Autowired
    private DenunciaRepository denunciaRepository;

    @Override
    public Denuncia registrarDenuncia(Integer idUsuarioDenunciante, CrearDenunciaDTO dto) {
        Denuncia denuncia = new Denuncia();
        
        denuncia.setIdUsuarioDenunciante(idUsuarioDenunciante);
        denuncia.setIdUsuarioDenunciado(dto.getIdUsuarioDenunciado());
        denuncia.setIdTipoDenuncia(dto.getIdTipoDenuncia());
        denuncia.setDescripcionDenuncia(dto.getDescripcionDenuncia());
        denuncia.setFechaDenuncia(LocalDateTime.now());
        denuncia.setIdTipoContenido(1); // 1 = Perfil
        
        return denunciaRepository.save(denuncia);
    }

    @Override
    public List<Denuncia> listarTodas() {
        return denunciaRepository.findAll();
    }
}