package com.coinly.api.messaging;

public sealed interface EnvioComandoResultado {

    record Sucesso(Long transacaoId, String emailAluno, String nomeAluno) implements EnvioComandoResultado {}

    record Falha(String motivo) implements EnvioComandoResultado {}

    record JaProcessado() implements EnvioComandoResultado {}
}
