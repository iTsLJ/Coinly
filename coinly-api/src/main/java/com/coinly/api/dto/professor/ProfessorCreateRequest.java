package com.coinly.api.dto.professor;

import com.coinly.api.validation.Cpf;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record ProfessorCreateRequest(
        @NotBlank @Size(max = 120) String nome,
        @NotBlank @Email @Size(max = 160) String email,
        @NotBlank @Cpf String cpf,
        @NotBlank @Size(max = 120) String departamento,
        @NotNull Long instituicaoId
) {
}
