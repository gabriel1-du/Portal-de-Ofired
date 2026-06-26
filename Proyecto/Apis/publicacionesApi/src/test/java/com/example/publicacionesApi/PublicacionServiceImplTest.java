package com.example.publicacionesApi;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import com.example.publicacionesApi.DTO.ClasesPublicacionesDTO.CrearPublicacionDTO;
import com.example.publicacionesApi.DTO.ClasesPublicacionesDTO.leerPublicacionesDTO;
import com.example.publicacionesApi.DTO.ClasesPublicacionesDTO.MapperPublicacionesDTO.CrearPublicacionMapper;
import com.example.publicacionesApi.DTO.ClasesPublicacionesDTO.MapperPublicacionesDTO.LeerPublicacionesMapper;
import com.example.publicacionesApi.Model.FotosPubli;
import com.example.publicacionesApi.Model.Publicacion;
import com.example.publicacionesApi.Repository.FotosPubliRepository;
import com.example.publicacionesApi.Repository.PublicacionRepository;
import com.example.publicacionesApi.RestClient.ComunaRestClient;
import com.example.publicacionesApi.RestClient.RegionRestClient;
import com.example.publicacionesApi.ServiceImpl.PublicacionServiceImpl;

@ExtendWith(MockitoExtension.class)
class PublicacionServiceImplTest {

    @Mock
    private PublicacionRepository publicacionRepository;

    @Mock
    private FotosPubliRepository fotosPubliRepository;

    @Mock
    private CrearPublicacionMapper crearPublicacionMapper;

    @Mock
    private LeerPublicacionesMapper leerPublicacionesMapper;

    @Mock
    private RegionRestClient regionRestClient;

    @Mock
    private ComunaRestClient comunaRestClient;

    @InjectMocks
    private PublicacionServiceImpl publicacionService;

    @Test
    @DisplayName("crear debe guardar la publicación, asignar la foto y retornar el DTO")
    void testCrearPublicacion() {
        // --- Arrange (Preparar) ---
        CrearPublicacionDTO dtoEntrada = new CrearPublicacionDTO();
        dtoEntrada.setTituloPublicacion("Vendo auto");
        dtoEntrada.setDescripcionPublicacion("Auto en buen estado");
        dtoEntrada.setImagenUrl("http://mi-imagen.com/auto.jpg");

        Publicacion entidadMapeada = new Publicacion();
        entidadMapeada.setTituloPublicacion("Vendo auto");
        entidadMapeada.setDescripcionPublicacion("Auto en buen estado");

        Publicacion entidadGuardada = new Publicacion();
        entidadGuardada.setIdPublicacion(100);
        entidadGuardada.setTituloPublicacion("Vendo auto");
        entidadGuardada.setCantidadLikes(0);

        leerPublicacionesDTO dtoSalidaEsperado = new leerPublicacionesDTO();
        dtoSalidaEsperado.setIdPublicacion(100);
        dtoSalidaEsperado.setTituloPublicacion("Vendo auto");
        dtoSalidaEsperado.setCantidadLikes(0);

        when(crearPublicacionMapper.crearPublicacionDTOtoPublicacion(dtoEntrada)).thenReturn(entidadMapeada);
        when(publicacionRepository.save(entidadMapeada)).thenReturn(entidadGuardada);
        when(fotosPubliRepository.save(any(FotosPubli.class))).thenReturn(new FotosPubli());
        when(leerPublicacionesMapper.toDTO(entidadGuardada)).thenReturn(dtoSalidaEsperado);

        // --- Act (Actuar) ---
        leerPublicacionesDTO resultado = publicacionService.crear(dtoEntrada);

        // 👇 CHIVATO PARA LA CONSOLA 👇
        System.out.println("✅ TEST CREAR - El servicio simuló guardar y devolvió una publicación con ID: " + resultado.getIdPublicacion() + " y Titulo: '" + resultado.getTituloPublicacion() + "'");

        // --- Assert (Verificar) ---
        assertNotNull(resultado, "El resultado no debe ser nulo");
        assertEquals(100, resultado.getIdPublicacion());
        assertEquals("Vendo auto", resultado.getTituloPublicacion());
        assertEquals("http://mi-imagen.com/auto.jpg", resultado.getImagenUrl(), "Debe haber seteado la URL de la imagen en la respuesta");
        
        verify(fotosPubliRepository, times(1)).save(any(FotosPubli.class));
    }

    @Test
    @DisplayName("obtenerPorId debe buscar la publicación y adjuntar su imagen si existe")
    void testObtenerPorId() {
        // --- Arrange ---
        Integer idBusqueda = 5;
        
        Publicacion publicacionEnBD = new Publicacion();
        publicacionEnBD.setIdPublicacion(idBusqueda);
        publicacionEnBD.setTituloPublicacion("Publicacion existente");

        leerPublicacionesDTO dtoBase = new leerPublicacionesDTO();
        dtoBase.setIdPublicacion(idBusqueda);
        dtoBase.setTituloPublicacion("Publicacion existente");

        List<FotosPubli> listaFotos = new ArrayList<>();
        FotosPubli foto = new FotosPubli();
        foto.setUrlFoto("http://foto.com/1.png");
        listaFotos.add(foto);

        when(publicacionRepository.findById(idBusqueda)).thenReturn(Optional.of(publicacionEnBD));
        when(leerPublicacionesMapper.toDTO(publicacionEnBD)).thenReturn(dtoBase);
        when(fotosPubliRepository.findByPublicacion_IdPublicacion(idBusqueda)).thenReturn(listaFotos);

        // --- Act ---
        leerPublicacionesDTO resultado = publicacionService.obtenerPorId(idBusqueda);

        // 👇 CHIVATO PARA LA CONSOLA 👇
        System.out.println("✅ TEST OBTENER - El servicio encontró la publicación (ID " + resultado.getIdPublicacion() + ") y le inyectó esta imagen: " + resultado.getImagenUrl());

        // --- Assert ---
        assertNotNull(resultado);
        assertEquals(idBusqueda, resultado.getIdPublicacion());
        assertEquals("http://foto.com/1.png", resultado.getImagenUrl(), "La URL de la foto debe inyectarse en el DTO");
    }

    @Test
    @DisplayName("eliminar debe verificar existencia y borrar la publicación")
    void testEliminarPublicacion() {
        // --- Arrange ---
        Integer idEliminar = 10;
        when(publicacionRepository.existsById(idEliminar)).thenReturn(true);
        doNothing().when(publicacionRepository).deleteById(idEliminar);

        // --- Act ---
        publicacionService.eliminar(idEliminar);

        // 👇 CHIVATO PARA LA CONSOLA 👇
        System.out.println("✅ TEST ELIMINAR - El servicio simuló la verificación y posterior eliminación de la publicación con ID: " + idEliminar);

        // --- Assert ---
        verify(publicacionRepository, times(1)).existsById(idEliminar);
        verify(publicacionRepository, times(1)).deleteById(idEliminar);
    }
}