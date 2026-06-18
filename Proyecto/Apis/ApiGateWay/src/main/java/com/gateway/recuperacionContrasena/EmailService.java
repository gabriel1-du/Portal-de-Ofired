package com.gateway.recuperacionContrasena;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

import com.mailjet.client.ClientOptions;
import com.mailjet.client.MailjetClient;
import com.mailjet.client.transactional.SendContact;
import com.mailjet.client.transactional.SendEmailsRequest;
import com.mailjet.client.transactional.TransactionalEmail;

@Service
public class EmailService {

    @Value("${MJ_APIKEY_PUBLIC}")
    private String apiKeyPublic;

    @Value("${MJ_APIKEY_PRIVATE}")
    private String apiKeyPrivate;

    public void enviarCorreoRecuperacion(String emailDestino, String token) {
        // 1. Inicializamos el cliente de Mailjet con las credenciales del entorno
        ClientOptions options = ClientOptions.builder()
                .apiKey(apiKeyPublic)
                .apiSecretKey(apiKeyPrivate)
                .build();
        
        MailjetClient client = new MailjetClient(options);
        String urlRecuperacion = "https://portal-de-ofired-1.onrender.com/recuperar-password?token=" + token;

        // 2. Construimos el correo de forma elegante (Fluent API)
        TransactionalEmail message = TransactionalEmail.builder()
                .from(new SendContact("gabrieldurans999@gmail.com", "Portal de Oficios"))
                .to(new SendContact(emailDestino))
                .subject("Restablecer Contraseña - Portal de Oficios")
                .htmlPart("<h3>Hola:</h3>"
                        + "<p>Recibimos una solicitud para cambiar tu clave.</p>"
                        + "<a href='" + urlRecuperacion + "'>Haz clic aquí para restablecer tu contraseña</a>")
                .build();

        // 3. Empaquetamos y enviamos por HTTP (Puerto 443, libre en Render)
        SendEmailsRequest request = SendEmailsRequest.builder()
                .message(message)
                .build();

        try {
            request.sendWith(client);
            System.out.println("✅ Correo real enviado exitosamente con Mailjet SDK");
        } catch (Exception e) {
            System.err.println("❌ Error en Mailjet: " + e.getMessage());
            throw new RuntimeException("Error en servicio de mensajería");
        }
    }
}