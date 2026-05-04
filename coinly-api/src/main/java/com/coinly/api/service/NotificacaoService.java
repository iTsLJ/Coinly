package com.coinly.api.service;

import jakarta.mail.internet.MimeMessage;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.ClassPathResource;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import org.thymeleaf.TemplateEngine;
import org.thymeleaf.context.Context;

import java.nio.charset.StandardCharsets;
import java.util.Map;

@Service
public class NotificacaoService {

    private static final Logger log = LoggerFactory.getLogger(NotificacaoService.class);

    private final JavaMailSender mailSender;
    private final TemplateEngine templateEngine;
    private final String remetente;

    public NotificacaoService(JavaMailSender mailSender,
                              TemplateEngine templateEngine,
                              @Value("${coinly.mail.from:no-reply@coinly.local}") String remetente) {
        this.mailSender = mailSender;
        this.templateEngine = templateEngine;
        this.remetente = remetente;
    }

    public void enviarCredenciais(String email, String nome, String senhaTemporaria) {
        Context context = new Context();
        context.setVariables(Map.of(
                "nome", nome,
                "email", email,
                "senha", senhaTemporaria
        ));
        String html = templateEngine.process("email/credenciais", context);
        enviarHtml(email, "Bem-vindo ao Coinly", html);
    }

    private void enviarHtml(String destinatario, String assunto, String html) {
        try {
            MimeMessage mensagem = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(mensagem, true, StandardCharsets.UTF_8.name());
            helper.setFrom(remetente);
            helper.setTo(destinatario);
            helper.setSubject(assunto);
            helper.setText(html, true);
            helper.addInline("coinly-logo", new ClassPathResource("static/coinly.png"), "image/png");
            mailSender.send(mensagem);
            log.info("Email enviado para {}", destinatario);
        } catch (Exception ex) {
            log.warn("Falha ao enviar email para {}: {}", destinatario, ex.getMessage());
        }
    }
}