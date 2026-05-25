package com.coinly.api.dto.professor;

import com.coinly.api.domain.Professor;

public record ProfessorResponse(
        Long id,
        String nome,
        String email,
        String cpf,
        String departamento,
        int saldoMoedas,
        boolean ativo,
        Long instituicaoId,
        String instituicaoNome
) {
    public static ProfessorResponse from(Professor professor) {
        return new ProfessorResponse(
                professor.getId(),
                professor.getNome(),
                professor.getEmail(),
                professor.getCpf(),
                professor.getDepartamento(),
                professor.getSaldoMoedas(),
                professor.isAtivo(),
                professor.getInstituicao().getId(),
                professor.getInstituicao().getNome()
        );
    }
}
