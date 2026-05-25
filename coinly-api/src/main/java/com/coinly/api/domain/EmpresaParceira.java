package com.coinly.api.domain;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "empresa_parceira")
@NoArgsConstructor
public class EmpresaParceira extends Usuario {

    @Column(nullable = false, unique = true, length = 18)
    private String cnpj;

    @Column(name = "nome_fantasia", nullable = false, length = 160)
    private String nomeFantasia;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private StatusEmpresa status = StatusEmpresa.PENDENTE;

	public String getCnpj() {
		return cnpj;
	}

	public void setCnpj(String cnpj) {
		this.cnpj = cnpj;
	}

	public String getNomeFantasia() {
		return nomeFantasia;
	}

	public void setNomeFantasia(String nomeFantasia) {
		this.nomeFantasia = nomeFantasia;
	}

	public StatusEmpresa getStatus() {
		return status;
	}

	public void setStatus(StatusEmpresa status) {
		this.status = status;
	}
    
    
}
