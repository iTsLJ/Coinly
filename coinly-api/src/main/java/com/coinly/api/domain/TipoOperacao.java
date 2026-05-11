package com.coinly.api.domain;

public enum TipoOperacao {

    ENVIO("Envio de moedas para aluno"),
    RESGATE("Resgate de vantagem"),
    RECEBIMENTO("Recebimento de moedas");

    private final String descricao;

    TipoOperacao(String descricao) {
        this.descricao = descricao;
    }

    public String getDescricao() {
        return descricao;
    }
}