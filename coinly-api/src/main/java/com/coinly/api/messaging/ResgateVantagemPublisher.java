package com.coinly.api.messaging;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.stereotype.Component;

@Component
public class ResgateVantagemPublisher {

    private static final Logger log = LoggerFactory.getLogger(ResgateVantagemPublisher.class);

    private final RabbitTemplate rabbitTemplate;

    public ResgateVantagemPublisher(RabbitTemplate rabbitTemplate) {
        this.rabbitTemplate = rabbitTemplate;
    }

    public void publicarResgate(VantagemResgatadaEvent event) {
        rabbitTemplate.convertAndSend(
                EnvioMoedasRouting.EVENTS_EXCHANGE,
                EnvioMoedasRouting.RESGATE_EVENT_SUCESSO_KEY,
                event
        );
        log.info("Evento VantagemResgatada publicado: transacaoId={} cupom={}",
                event.transacaoId(), event.codigoCupom());
    }
}
