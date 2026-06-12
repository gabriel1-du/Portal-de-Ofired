package com.example.usuarioApi.ServiceImpl; // <-- Apunta a tu carpeta actual

// 👇 Estos dos imports eran los que te faltaban
import com.example.usuarioApi.Service.DenunciaService;
import com.example.usuarioApi.DTO.ClasesDenunciaDTO.CrearDenunciaDTO;

import com.example.usuarioApi.Model.Denuncia;
import com.example.usuarioApi.Model.TipoContenidoDenunciado;
import com.example.usuarioApi.Model.TipoDenuncia;
import com.example.usuarioApi.Model.Usuario;
import com.example.usuarioApi.Repository.DenunciaRepository;
import com.example.usuarioApi.Repository.TipoContenidoDenunciadoRepository;
import com.example.usuarioApi.Repository.TipoDenunciaRepository;
import com.example.usuarioApi.Repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class DenunciaServiceImpl implements DenunciaService {

    @Autowired
    private DenunciaRepository denunciaRepository;

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private TipoDenunciaRepository tipoDenunciaRepository;

    @Autowired
    private TipoContenidoDenunciadoRepository tipoContenidoDenunciadoRepository;

    @Override
    public Denuncia registrarDenuncia(CrearDenunciaDTO dto) {
        Denuncia denuncia = new Denuncia();
        
        Usuario usuarioDenunciado = usuarioRepository.findById(dto.getIdUsuarioDenunciado())
                .orElseThrow(() -> new RuntimeException("Usuario denunciado no encontrado"));
                
        TipoDenuncia tipoDenuncia = tipoDenunciaRepository.findById(dto.getIdTipoDenuncia())
                .orElseThrow(() -> new RuntimeException("Tipo de denuncia no encontrado"));
                
        TipoContenidoDenunciado tipoContenido = tipoContenidoDenunciadoRepository.findById(dto.getIdTipoContenido())
                .orElseThrow(() -> new RuntimeException("Tipo de contenido no encontrado"));

        denuncia.setIdUsuarioDenunciante(dto.getIdUsuarioDenunciante());
        denuncia.setUsuarioDenunciado(usuarioDenunciado);
        denuncia.setTipoDenuncia(tipoDenuncia);
        denuncia.setDescripcionDenuncia(dto.getDescripcionDenuncia());
        denuncia.setTipoContenido(tipoContenido);
        
        return denunciaRepository.save(denuncia);
    }

    @Override
    public List<Denuncia> listarTodas() {
        return denunciaRepository.findAll();
    }
}