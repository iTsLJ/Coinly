package com.coinly.api.messaging;

import com.coinly.api.service.NotificacaoService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.amqp.rabbit.annotation.RabbitHandler;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Component;

@Component
@RabbitListener(queues = EnvioMoedasRouting.RESGATE_EVENT_EMAIL_QUEUE)
public class ResgateVantagemEventConsumer {

    private static final Logger log = LoggerFactory.getLogger(ResgateVantagemEventConsumer.class);

    private final NotificacaoService notificacaoService;

    public ResgateVantagemEventConsumer(NotificacaoService notificacaoService) {
        this.notificacaoService = notificacaoService;
    }

    @RabbitHandler
    public void onResgate(VantagemResgatadaEvent event) {
        log.info("Enviando e-mails de resgate: transacaoId={} aluno={} parceiro={}",
                event.transacaoId(), event.emailAluno(), event.emailParceiro());
        notificacaoService.enviarCupomResgate(event.emailAluno(), event.nomeVantagem(), event.codigoCupom());
        notificacaoService.notificarParceiroResgate(event.emailParceiro(), event.nomeAluno(),
                event.nomeVantagem(), event.codigoCupom());
    }

    @RabbitHandler(isDefault = true)
    public void onDesconhecido(Object payload) {
        log.warn("Evento desconhecido na fila de e-mail de resgate: {}", payload);
    }
}
