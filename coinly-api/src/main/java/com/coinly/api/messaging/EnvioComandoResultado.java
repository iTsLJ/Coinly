package com.coinly.api.messaging;

public sealed interface EnvioComandoResultado {

    record Sucesso(
            Long transacaoId,
            String emailProfessor,
            int saldoProfessor,
            String emailAluno,
            String nomeAluno,
            int saldoAluno
    ) implements EnvioComandoResultado {}

    record Falha(String motivo) implements EnvioComandoResultado {}

    record JaProcessado() implements EnvioComandoResultado {}
}
