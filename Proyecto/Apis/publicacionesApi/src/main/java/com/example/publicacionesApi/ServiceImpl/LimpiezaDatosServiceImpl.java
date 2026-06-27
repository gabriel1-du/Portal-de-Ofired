package com.example.publicacionesApi.ServiceImpl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.publicacionesApi.Repository.PublicacionRepository;
import com.example.publicacionesApi.Repository.ReseniaRepository;
import com.example.publicacionesApi.Repository.RespuestaComentarioRepository;
import com.example.publicacionesApi.Repository.RespuestaReseniaRepository;

@Service
public class LimpiezaDatosServiceImpl {

    @Autowired
    private PublicacionRepository publicacionRepository;
    @Autowired
    private ReseniaRepository reseniaRepository;
    @Autowired
    private RespuestaComentarioRepository respuestaComentarioRepository;
    @Autowired
    private RespuestaReseniaRepository respuestaReseniaRepository;

    @Transactional
    public void purgarDatosDeUsuario(Integer idUsuario) {
        // Borramos todas las interacciones donde el usuario participe
        respuestaReseniaRepository.eliminarPorAutor(idUsuario); //[cite: 25]
        respuestaComentarioRepository.eliminarPorUsuario(idUsuario); //[cite: 24]
        reseniaRepository.eliminarPorUsuario(idUsuario, idUsuario); // Borra las que escribió y las que recibió[cite: 23]
        publicacionRepository.eliminarPorAutor(idUsuario); //[cite: 22]
    }



}
