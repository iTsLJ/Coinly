package com.coinly.api.messaging;

import java.time.Instant;

public record VantagemResgatadaEvent(
        Long transacaoId,
        String emailAluno,
        String nomeAluno,
        String emailParceiro,
        String nomeVantagem,
        String codigoCupom,
        Instant ocorridoEm
) {}
