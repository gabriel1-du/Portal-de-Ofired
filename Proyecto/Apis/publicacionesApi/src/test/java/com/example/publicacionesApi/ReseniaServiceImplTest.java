package com.example.publicacionesApi;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
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

import com.example.publicacionesApi.DTO.ClasesReseniasDTO.CrearReniaDTO;
import com.example.publicacionesApi.DTO.ClasesReseniasDTO.LeerReseniaDTO;
import com.example.publicacionesApi.DTO.ClasesReseniasDTO.LeerReseniaFrontDTO;
import com.example.publicacionesApi.DTO.ClasesReseniasDTO.MapperRenia.UsuarioMapperReseniaDTO;
import com.example.publicacionesApi.Model.Resenia;
import com.example.publicacionesApi.Repository.ReseniaRepository;
import com.example.publicacionesApi.RestClient.PerfilRestClient;
import com.example.publicacionesApi.RestClient.UsuarioRestClient;
import com.example.publicacionesApi.RestClientDTO.PerfilExternoDTO;
import com.example.publicacionesApi.ServiceImpl.ReseniaServiceImpl;

@ExtendWith(MockitoExtension.class)
class ReseniaServiceImplTest {

    @Mock
    private ReseniaRepository reseniaRepository;

    @Mock
    private UsuarioMapperReseniaDTO reseniaMapper;

    @Mock
    private UsuarioRestClient usuarioRestClient;

    @Mock
    private PerfilRestClient perfilRestClient;

    @InjectMocks
    private ReseniaServiceImpl reseniaService;

    @Test
    @DisplayName("crear debe guardar la reseña y actualizar el promedio del usuario")
    void testCrearResenia() {
        // --- Arrange ---
        Integer idUsuarioReseniado = 50;

        CrearReniaDTO dtoEntrada = new CrearReniaDTO();
        dtoEntrada.setIdAutor(10);
        dtoEntrada.setIdUsuarioReseniado(idUsuarioReseniado);
        dtoEntrada.setCalificacion(5.0);
        dtoEntrada.setTextoResenia("¡Excelente servicio!");

        Resenia entidad = new Resenia();
        entidad.setIdUsuarioReseniado(idUsuarioReseniado);
        entidad.setCalificacion(5.0);

        Resenia entidadGuardada = new Resenia();
        entidadGuardada.setIdResenia(1);
        entidadGuardada.setIdUsuarioReseniado(idUsuarioReseniado);
        entidadGuardada.setCalificacion(5.0);

        LeerReseniaDTO dtoSalida = new LeerReseniaDTO();
        dtoSalida.setIdResenia(1);
        dtoSalida.setCalificacion(5.0);
        dtoSalida.setTextoResenia("¡Excelente servicio!");

        // Simulamos la creación y guardado
        when(reseniaMapper.toEntity(dtoEntrada)).thenReturn(entidad);
        when(reseniaRepository.save(entidad)).thenReturn(entidadGuardada);
        when(reseniaMapper.toLeerReseniaDTO(entidadGuardada)).thenReturn(dtoSalida);

        // Simulamos el cálculo del promedio (esto usa listarPorUsuarioReseniado internamente)
        List<Resenia> listaReseniasBD = new ArrayList<>();
        listaReseniasBD.add(entidadGuardada);
        when(reseniaRepository.findByIdUsuarioReseniado(idUsuarioReseniado)).thenReturn(listaReseniasBD);

        LeerReseniaFrontDTO frontDTO = new LeerReseniaFrontDTO();
        frontDTO.setCalificacion(5.0);
        when(reseniaMapper.toLeerReseniaFrontDTO(any(Resenia.class))).thenReturn(frontDTO);

        // Simulamos la respuesta de los RestClients (APIs externas)
        doNothing().when(usuarioRestClient).actualizarUsuario(eq(idUsuarioReseniado), any());
        
        PerfilExternoDTO perfilMock = new PerfilExternoDTO();
        perfilMock.setIdPerfilUsuario(99);
        when(perfilRestClient.obtenerPerfilPorUsuario(idUsuarioReseniado)).thenReturn(perfilMock);
        doNothing().when(perfilRestClient).actualizarPerfil(eq(99), any());

        // --- Act ---
        LeerReseniaDTO resultado = reseniaService.crear(dtoEntrada);

        // 👇 CHIVATO PARA LA CONSOLA 👇
        System.out.println("✅ TEST CREAR RESEÑA - Se guardó la reseña ID: " + resultado.getIdResenia() + ". Se simuló la actualización en APIs externas exitosamente.");

        // --- Assert ---
        assertNotNull(resultado);
        assertEquals(1, resultado.getIdResenia());
        assertEquals(5.0, resultado.getCalificacion());
    }

    @Test
    @DisplayName("obtenerPorId debe buscar y retornar la reseña solicitada")
    void testObtenerPorId() {
        // --- Arrange ---
        Integer idResenia = 1;
        Resenia reseniaMock = new Resenia();
        reseniaMock.setIdResenia(idResenia);
        reseniaMock.setTextoResenia("Todo bien");

        LeerReseniaDTO dtoMock = new LeerReseniaDTO();
        dtoMock.setIdResenia(idResenia);
        dtoMock.setTextoResenia("Todo bien");

        when(reseniaRepository.findById(idResenia)).thenReturn(Optional.of(reseniaMock));
        when(reseniaMapper.toLeerReseniaDTO(reseniaMock)).thenReturn(dtoMock);

        // --- Act ---
        LeerReseniaDTO resultado = reseniaService.obtenerPorId(idResenia);

        // 👇 CHIVATO PARA LA CONSOLA 👇
        System.out.println("✅ TEST OBTENER RESEÑA - El servicio encontró la reseña ID " + idResenia + " diciendo: '" + resultado.getTextoResenia() + "'");

        // --- Assert ---
        assertNotNull(resultado);
        assertEquals(idResenia, resultado.getIdResenia());
    }

    @Test
    @DisplayName("eliminar debe validar si existe y borrar del repositorio")
    void testEliminarResenia() {
        // --- Arrange ---
        Integer idResenia = 10;
        when(reseniaRepository.existsById(idResenia)).thenReturn(true);
        doNothing().when(reseniaRepository).deleteById(idResenia);

        // --- Act ---
        reseniaService.eliminar(idResenia);

        // 👇 CHIVATO PARA LA CONSOLA 👇
        System.out.println("✅ TEST ELIMINAR RESEÑA - El servicio verificó existencia y eliminó la reseña ID: " + idResenia);

        // --- Assert ---
        verify(reseniaRepository, times(1)).deleteById(idResenia);
    }
}