package com.coinly.api.dto.empresa;

import com.coinly.api.validation.Cnpj;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record EmpresaParceiraCreateRequest(
        @NotBlank @Size(max = 160) String nomeFantasia,
        @NotBlank @Cnpj String cnpj,
        @NotBlank @Email @Size(max = 160) String email
) {
}