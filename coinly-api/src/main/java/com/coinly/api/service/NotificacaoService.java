package com.coinly.api.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class NotificacaoService {

    private static final Logger log = LoggerFactory.getLogger(NotificacaoService.class);

    private final JavaMailSender mailSender;
    private final String remetente;

    public NotificacaoService(JavaMailSender mailSender,
                              @Value("${coinly.mail.from:no-reply@coinly.local}") String remetente) {
        this.mailSender = mailSender;
        this.remetente = remetente;
    }

    public void enviarCredenciais(String email, String nome, String senhaTemporaria) {
        String assunto = "Bem-vindo ao Coinly";
        String corpo = String.format(
                "Olá, %s!%n%nSeu cadastro foi realizado com sucesso.%n" +
                        "Use as credenciais abaixo para acessar o sistema:%n%n" +
                        "Login: %s%nSenha: %s%n%n" +
                        "Recomendamos alterar a senha no primeiro acesso.",
                nome, email, senhaTemporaria);
        enviar(email, assunto, corpo);
    }

    private void enviar(String destinatario, String assunto, String corpo) {
        try {
            SimpleMailMessage mensagem = new SimpleMailMessage();
            mensagem.setFrom(remetente);
            mensagem.setTo(destinatario);
            mensagem.setSubject(assunto);
            mensagem.setText(corpo);
            mailSender.send(mensagem);
            log.info("Email enviado para {}", destinatario);
        } catch (Exception ex) {
            log.warn("Falha ao enviar email para {}: {}. Conteúdo:%n{}",
                    destinatario, ex.getMessage(), corpo);
        }
    }
}
