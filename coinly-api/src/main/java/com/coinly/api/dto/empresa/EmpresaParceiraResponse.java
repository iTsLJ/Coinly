package com.coinly.api.dto.empresa;

import com.coinly.api.domain.EmpresaParceira;
import com.coinly.api.domain.StatusEmpresa;

public record EmpresaParceiraResponse(
        Long id,
        String nomeFantasia,
        String cnpj,
        String email,
        StatusEmpresa status
) {
    public static EmpresaParceiraResponse from(EmpresaParceira empresa) {
        return new EmpresaParceiraResponse(
                empresa.getId(),
                empresa.getNomeFantasia(),
                empresa.getCnpj(),
                empresa.getEmail(),
                empresa.getStatus()
        );
    }
}
