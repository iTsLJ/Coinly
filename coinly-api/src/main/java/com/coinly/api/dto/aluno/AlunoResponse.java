package com.coinly.api.dto.aluno;

import com.coinly.api.domain.Aluno;

public record AlunoResponse(
        Long id,
        String nome,
        String email,
        String cpf,
        String rg,
        String endereco,
        String curso,
        int saldoMoedas,
        Long instituicaoId,
        String instituicaoNome
) {
    public static AlunoResponse from(Aluno aluno) {
        return new AlunoResponse(
                aluno.getId(),
                aluno.getNome(),
                aluno.getEmail(),
                aluno.getCpf(),
                aluno.getRg(),
                aluno.getEndereco(),
                aluno.getCurso(),
                aluno.getSaldoMoedas(),
                aluno.getInstituicao().getId(),
                aluno.getInstituicao().getNome()
        );
    }
}
