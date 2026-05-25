package com.coinly.api.repository;

import com.coinly.api.domain.Transacao;
import com.coinly.api.domain.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface TransacaoRepository extends JpaRepository<Transacao, Long> {

	List<Transacao> findByRemetenteOrDestinatarioOrderByDataDesc(Usuario usuario, Usuario usuario2);
}