package com.coinly.api.messaging;

import java.time.Instant;

public record EnvioMoedasFalhouEvent(
        String commandId,
        String emailProfessor,
        Long alunoId,
        int quantidade,
        String motivo,
        Instant ocorridoEm
) {}
