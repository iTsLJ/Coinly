package com.coinly.api.messaging;

import com.coinly.api.service.TransacaoService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Component;

import java.time.Instant;

@Component
public class EnvioMoedasCommandConsumer {

    private static final Logger log = LoggerFactory.getLogger(EnvioMoedasCommandConsumer.class);

    private final TransacaoService transacaoService;
    private final EnvioMoedasPublisher publisher;

    public EnvioMoedasCommandConsumer(TransacaoService transacaoService, EnvioMoedasPublisher publisher) {
        this.transacaoService = transacaoService;
        this.publisher = publisher;
    }

    @RabbitListener(queues = EnvioMoedasRouting.COMMAND_QUEUE)
    public void onMessage(EnviarMoedasCommand command) {
        log.info("Recebido comando EnviarMoedas: commandId={} alunoId={} quantidade={}",
                command.commandId(), command.alunoId(), command.quantidade());

        EnvioComandoResultado resultado;
        try {
            resultado = transacaoService.processarEnvioComando(command);
        } catch (DataIntegrityViolationException race) {
            log.info("Comando ja processado (corrida de concorrencia): commandId={}", command.commandId());
            return;
        }

        switch (resultado) {
            case EnvioComandoResultado.Sucesso s -> publisher.publicarSucesso(new MoedasEnviadasEvent(
                    command.commandId(),
                    s.transacaoId(),
                    s.emailAluno(),
                    s.nomeAluno(),
                    command.quantidade(),
                    Instant.now()
            ));
            case EnvioComandoResultado.Falha f -> publisher.publicarFalha(new EnvioMoedasFalhouEvent(
                    command.commandId(),
                    command.emailProfessor(),
                    command.alunoId(),
                    command.quantidade(),
                    f.motivo(),
                    Instant.now()
            ));
            case EnvioComandoResultado.JaProcessado j -> log.info("Comando ja processado: commandId={}", command.commandId());
        }
    }
}
