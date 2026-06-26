package com.example.publicacionesApi;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.web.multipart.MultipartFile;

import com.example.publicacionesApi.DTO.FotosPubliDTO.FotosPubliDTO;
import com.example.publicacionesApi.DTO.FotosPubliDTO.FotosPubliMapper;
import com.example.publicacionesApi.Minio.MinioStorageService;
import com.example.publicacionesApi.Model.FotosPubli;
import com.example.publicacionesApi.Model.Publicacion;
import com.example.publicacionesApi.Repository.FotosPubliRepository;
import com.example.publicacionesApi.ServiceImpl.FotosPubliServiceImpl;

@ExtendWith(MockitoExtension.class)
class FotosPubliServiceImplTest {

    @Mock
    private FotosPubliRepository fotosPubliRepository;

    @Mock
    private MinioStorageService minioStorageService;

    @Mock
    private FotosPubliMapper fotosPubliMapper;

    @InjectMocks
    private FotosPubliServiceImpl fotosPubliService;

    @Test
    @DisplayName("listarPorPublicacion debe devolver lista de FotosPubliDTO")
    void testListarPorPublicacion() {
        // --- Arrange ---
        Integer idPublicacion = 100;
        
        Publicacion publicacionMock = new Publicacion();
        publicacionMock.setIdPublicacion(idPublicacion);

        FotosPubli fotoEntidad = new FotosPubli();
        fotoEntidad.setIdFotoPubli(1);
        fotoEntidad.setUrlFoto("http://minio/foto1.jpg");
        fotoEntidad.setPublicacion(publicacionMock);

        List<FotosPubli> listaEntidades = new ArrayList<>();
        listaEntidades.add(fotoEntidad);

        FotosPubliDTO fotoDTO = new FotosPubliDTO();
        fotoDTO.setIdFotoPubli(1);
        fotoDTO.setIdPublicacion(idPublicacion);
        fotoDTO.setUrlFoto("http://minio/foto1.jpg");

        when(fotosPubliRepository.findByPublicacion_IdPublicacion(idPublicacion)).thenReturn(listaEntidades);
        when(fotosPubliMapper.toDTO(fotoEntidad)).thenReturn(fotoDTO);

        // --- Act ---
        List<FotosPubliDTO> resultado = fotosPubliService.listarPorPublicacion(idPublicacion);

        // 👇 CHIVATO PARA LA CONSOLA 👇
        System.out.println("✅ TEST LISTAR FOTOS - El servicio buscó fotos para la publicación " + idPublicacion + " y encontró: " + resultado.size() + " foto(s). URL: " + resultado.get(0).getUrlFoto());

        // --- Assert ---
        assertNotNull(resultado);
        assertEquals(1, resultado.size());
        assertEquals("http://minio/foto1.jpg", resultado.get(0).getUrlFoto());
    }

    @Test
    @DisplayName("agregar debe simular la subida a MinIO y guardar la URL en BD")
    void testAgregarFoto() throws IOException {
        // --- Arrange ---
        // 1. Simulamos el archivo que envía el usuario desde el frontend
        MultipartFile archivoMock = mock(MultipartFile.class);
        when(archivoMock.isEmpty()).thenReturn(false);

        // 2. Simulamos la respuesta de MinIO
        String urlGeneradaPorMinio = "http://minio.tu-servidor.com/imagen_nueva.png";
        when(minioStorageService.subirArchivo(archivoMock)).thenReturn(urlGeneradaPorMinio);

        // 3. Preparamos los DTOs y Entidades
        FotosPubliDTO dtoEntrada = new FotosPubliDTO();
        dtoEntrada.setIdPublicacion(50);

        FotosPubli entidadMapeada = new FotosPubli();
        entidadMapeada.setUrlFoto(urlGeneradaPorMinio);

        FotosPubli entidadGuardada = new FotosPubli();
        entidadGuardada.setIdFotoPubli(99);
        entidadGuardada.setUrlFoto(urlGeneradaPorMinio);

        FotosPubliDTO dtoSalida = new FotosPubliDTO();
        dtoSalida.setIdFotoPubli(99);
        dtoSalida.setIdPublicacion(50);
        dtoSalida.setUrlFoto(urlGeneradaPorMinio);

        // 4. Simulamos Mapper y Repo
        when(fotosPubliMapper.toEntity(dtoEntrada, urlGeneradaPorMinio)).thenReturn(entidadMapeada);
        when(fotosPubliRepository.save(entidadMapeada)).thenReturn(entidadGuardada);
        when(fotosPubliMapper.toDTO(entidadGuardada)).thenReturn(dtoSalida);

        // --- Act ---
        FotosPubliDTO resultado = fotosPubliService.agregar(dtoEntrada, archivoMock);

        // 👇 CHIVATO PARA LA CONSOLA 👇
        System.out.println("✅ TEST AGREGAR FOTO - El servicio simuló subir a MinIO y guardó la foto. ID asignado: " + resultado.getIdFotoPubli() + " | URL Generada: " + resultado.getUrlFoto());

        // --- Assert ---
        assertNotNull(resultado);
        assertEquals(99, resultado.getIdFotoPubli());
        assertEquals(urlGeneradaPorMinio, resultado.getUrlFoto());
        
        verify(minioStorageService, times(1)).subirArchivo(archivoMock);
        verify(fotosPubliRepository, times(1)).save(entidadMapeada);
    }

    @Test
    @DisplayName("eliminar debe llamar al delete del repositorio")
    void testEliminarFoto() {
        // --- Arrange ---
        Integer idFotoEliminar = 99;
        doNothing().when(fotosPubliRepository).deleteById(idFotoEliminar);

        // --- Act ---
        fotosPubliService.eliminar(idFotoEliminar);

        // 👇 CHIVATO PARA LA CONSOLA 👇
        System.out.println("✅ TEST ELIMINAR FOTO - El servicio simuló borrar exitosamente la foto con ID: " + idFotoEliminar);

        // --- Assert ---
        verify(fotosPubliRepository, times(1)).deleteById(idFotoEliminar);
    }
}