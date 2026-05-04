package com.coinly.api.dto.instituicao;

import com.coinly.api.domain.Instituicao;

public record InstituicaoResponse(
        Long id,
        String nome,
        String cnpj,
        boolean ativo
) {
    public static InstituicaoResponse from(Instituicao instituicao) {
        return new InstituicaoResponse(
                instituicao.getId(),
                instituicao.getNome(),
                instituicao.getCnpj(),
                instituicao.isAtivo()
        );
    }
}