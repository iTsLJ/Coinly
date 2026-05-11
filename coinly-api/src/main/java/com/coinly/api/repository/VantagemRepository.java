package com.coinly.api.repository;

import com.coinly.api.domain.Vantagem;
import com.coinly.api.domain.EmpresaParceira;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface VantagemRepository extends JpaRepository<Vantagem, Long> {
    List<Vantagem> findAllByEmpresa(EmpresaParceira empresa);
}