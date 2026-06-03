package com.coinly.api.repository;

import com.coinly.api.domain.Instituicao;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface InstituicaoRepository extends JpaRepository<Instituicao, Long> {

    boolean existsByCnpj(String cnpj);

    Optional<Instituicao> findByCnpj(String cnpj);
}
