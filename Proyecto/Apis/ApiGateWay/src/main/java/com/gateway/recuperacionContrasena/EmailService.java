package com.gateway.recuperacionContrasena;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;

    public void enviarCorreoRecuperacion(String emailDestino, String token) {
    SimpleMailMessage message = new SimpleMailMessage();
    
    // Cambia esto por tu correo real de Gmail para evitar problemas de alineación de remitente
    message.setFrom("gabrieldurans999@gmail.com"); 
    message.setTo(emailDestino);
    message.setSubject("Restablecer Contraseña - Portal de Oficios");
    
    String urlRecuperacion = "https://portal-de-ofired-1.onrender.com/recuperar-password?token=" + token;
    
    String cuerpoMensaje = "Hola:\n\n"
            + "Recibimos una solicitud para cambiar tu contraseña.\n"
            + "Ingresa al siguiente enlace para completar el proceso:\n\n"
            + urlRecuperacion + "\n\n"
            + "Atentamente,\nEl equipo de Portal de Oficios.";
            
    message.setText(cuerpoMensaje);
    mailSender.send(message);
}
}