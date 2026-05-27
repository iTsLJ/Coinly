package com.coinly.api.messaging;

public record ResgateResultado(
        Long transacaoId,
        String codigoCupom,
        String emailAluno,
        String nomeAluno,
        String emailParceiro,
        String nomeVantagem
) {}
