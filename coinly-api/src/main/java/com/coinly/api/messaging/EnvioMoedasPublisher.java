package com.coinly.api.messaging;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.stereotype.Component;

@Component
public class EnvioMoedasPublisher {

    private static final Logger log = LoggerFactory.getLogger(EnvioMoedasPublisher.class);

    private final RabbitTemplate rabbitTemplate;

    public EnvioMoedasPublisher(RabbitTemplate rabbitTemplate) {
        this.rabbitTemplate = rabbitTemplate;
    }

    public void publicarComando(EnviarMoedasCommand command) {
        rabbitTemplate.convertAndSend(
                EnvioMoedasRouting.COMMANDS_EXCHANGE,
                EnvioMoedasRouting.COMMAND_ROUTING_KEY,
                command
        );
        log.info("Comando EnviarMoedas publicado: commandId={} alunoId={} quantidade={}",
                command.commandId(), command.alunoId(), command.quantidade());
    }

    public void publicarSucesso(MoedasEnviadasEvent event) {
        rabbitTemplate.convertAndSend(
                EnvioMoedasRouting.EVENTS_EXCHANGE,
                EnvioMoedasRouting.EVENT_SUCESSO_KEY,
                event
        );
        log.info("Evento MoedasEnviadas publicado: commandId={} transacaoId={}",
                event.commandId(), event.transacaoId());
    }

    public void publicarFalha(EnvioMoedasFalhouEvent event) {
        rabbitTemplate.convertAndSend(
                EnvioMoedasRouting.EVENTS_EXCHANGE,
                EnvioMoedasRouting.EVENT_FALHOU_KEY,
                event
        );
        log.info("Evento EnvioMoedasFalhou publicado: commandId={} motivo={}",
                event.commandId(), event.motivo());
    }
}
