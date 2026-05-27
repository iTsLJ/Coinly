package com.coinly.api.messaging;

import java.time.Instant;

public record MoedasEnviadasEvent(
        String commandId,
        Long transacaoId,
        String emailAluno,
        String nomeAluno,
        int quantidade,
        Instant ocorridoEm
) {}
