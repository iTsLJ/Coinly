package com.coinly.api.repository;

import com.coinly.api.domain.Instituicao;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface InstituicaoRepository extends JpaRepository<Instituicao, Long> {

    boolean existsByCnpj(String cnpj);
}
