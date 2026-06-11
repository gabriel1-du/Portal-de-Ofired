package com.gateway.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.client.RestTemplate;

@Configuration
public class AppConfig {
    @Bean
    public RestTemplate restTemplate() {
        RestTemplate restTemplate = new RestTemplate();
    
        // Añadir un interceptor global a la Gateway
        restTemplate.getInterceptors().add((request, body, execution) -> {
            request.getHeaders().set("Accept-Encoding", "identity");
            return execution.execute(request, body);
        });
        
        return restTemplate;
    }
}