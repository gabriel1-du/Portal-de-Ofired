package com.example.usuarioApi.Minio;

import java.io.IOException;
import java.util.UUID;

import org.springframework.web.multipart.MultipartFile;

import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import software.amazon.awssdk.core.sync.RequestBody;

@Service
public class MinioStorageService {

    private final S3Client s3Client;

    @Value("${minio.bucket-name}")
    private String bucketName;

    @Value("${minio.endpoint}")
    private String endpoint;

    // INYECTAMOS LA URL PÚBLICA DE LA NUBE
    @Value("${minio.public-url}")
    private String publicUrl;

    public MinioStorageService(S3Client s3Client) {
        this.s3Client = s3Client;
    }

    public String subirArchivo(MultipartFile archivo) throws IOException {
        // Generar un nombre único para evitar colisiones
        String nombreArchivo = UUID.randomUUID().toString() + "_" + archivo.getOriginalFilename();

        PutObjectRequest putObjectRequest = PutObjectRequest.builder()
                .bucket(bucketName)
                .key(nombreArchivo)
                .contentType(archivo.getContentType())
                .build();

        // Enviar los bytes del archivo a nuestro contenedor Docker
        s3Client.putObject(putObjectRequest, 
                RequestBody.fromInputStream(archivo.getInputStream(), archivo.getSize()));

        // Retornar la URL pública local para que React renderice la imagen
        // Estructura: http://localhost:9000/nombre-bucket/nombre-archivo
        return publicUrl + "/" + nombreArchivo;
    }

}
