package com.coinly.api.messaging;

import com.coinly.api.service.NotificacaoService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.amqp.rabbit.annotation.RabbitHandler;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Component;

@Component
@RabbitListener(queues = EnvioMoedasRouting.EVENT_EMAIL_QUEUE)
public class EnvioMoedasEventConsumer {

    private static final Logger log = LoggerFactory.getLogger(EnvioMoedasEventConsumer.class);

    private final NotificacaoService notificacaoService;

    public EnvioMoedasEventConsumer(NotificacaoService notificacaoService) {
        this.notificacaoService = notificacaoService;
    }

    @RabbitHandler
    public void onSucesso(MoedasEnviadasEvent event) {
        log.info("Enviando e-mail de recebimento: commandId={} para={}", event.commandId(), event.emailAluno());
        notificacaoService.notificarRecebimentoMoedas(event.emailAluno(), event.nomeAluno(), event.quantidade());
    }

    @RabbitHandler
    public void onFalha(EnvioMoedasFalhouEvent event) {
        log.warn("Envio falhou: commandId={} professor={} motivo={}",
                event.commandId(), event.emailProfessor(), event.motivo());
    }

    @RabbitHandler(isDefault = true)
    public void onDesconhecido(Object payload) {
        log.warn("Evento desconhecido na fila de e-mail: {}", payload);
    }
}
