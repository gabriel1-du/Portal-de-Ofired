package com.example.publicacionesApi.Minio;

import java.net.URI;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import software.amazon.awssdk.auth.credentials.AwsBasicCredentials;
import software.amazon.awssdk.auth.credentials.StaticCredentialsProvider;
import software.amazon.awssdk.regions.Region;
import software.amazon.awssdk.services.s3.S3Client;

@Configuration
public class MinioS3Config {

    @Value("${minio.endpoint}") //Variable que gaurda el endpoint de Minio, se obtiene del archivo application.properties
    private String endpoint;

    @Value("${minio.access-key}") //variable que guarda el access key de Minio, se obtiene del archivo application.properties
    private String accessKey;

    @Value("${minio.secret-key}") // variable que guarda el secret key de Minio, se obtiene del archivo application.properties
    private String secretKey;

    @Bean
    public S3Client s3Client() {
        return S3Client.builder()
                .endpointOverride(URI.create(endpoint))
                .credentialsProvider(StaticCredentialsProvider.create(
                        AwsBasicCredentials.create(accessKey, secretKey)
                ))
                .region(Region.US_EAST_1)
                .forcePathStyle(true) 
                .build();
    }


}
