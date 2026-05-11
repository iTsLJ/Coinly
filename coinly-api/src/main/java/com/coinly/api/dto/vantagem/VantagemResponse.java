package com.coinly.api.dto.vantagem;

import com.coinly.api.domain.Vantagem;

public record VantagemResponse(
    Long id,
    String nome,
    String descricao,
    String fotoUrl,
    int custoMoedas,
    Long empresaId,
    String empresaNome
) {
    public static VantagemResponse from(Vantagem vantagem) {
        return new VantagemResponse(
                vantagem.getId(),
                vantagem.getNome(),
                vantagem.getDescricao(),
                vantagem.getFotoUrl(),
                vantagem.getCustoMoedas(),
                vantagem.getEmpresa().getId(),
                vantagem.getEmpresa().getNome()
        );
    }
}