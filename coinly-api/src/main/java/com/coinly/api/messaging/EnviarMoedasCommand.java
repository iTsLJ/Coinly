package com.coinly.api.messaging;

import java.time.Instant;

public record EnviarMoedasCommand(
        String commandId,
        String emailProfessor,
        Long alunoId,
        int quantidade,
        String mensagem,
        Instant publicadoEm
) {}
