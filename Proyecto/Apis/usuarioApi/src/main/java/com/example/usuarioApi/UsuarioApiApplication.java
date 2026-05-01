package com.example.usuarioApi;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import io.github.cdimascio.dotenv.Dotenv;

@SpringBootApplication
public class UsuarioApiApplication {
    
	public static void main(String[] args) {

		// Carga el archivo .env
        Dotenv dotenv = Dotenv.configure().ignoreIfMissing().load();
        
        // Inteccion de propiedades
        dotenv.entries().forEach(entry -> 
            System.setProperty(entry.getKey(), entry.getValue())
        );

		System.out.println("--- CONECTANDO A: " + System.getProperty("DB_URL") + " ---");

		SpringApplication.run(UsuarioApiApplication.class, args);
	}

}
