package com.coinly.api.service;

import java.util.List;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.coinly.api.domain.Aluno;
import com.coinly.api.domain.Professor;
import com.coinly.api.domain.TipoOperacao;
import com.coinly.api.domain.Transacao;
import com.coinly.api.domain.Usuario;
import com.coinly.api.domain.Vantagem;
import com.coinly.api.dto.enviarMoedas.EnviarMoedasRequest;
import com.coinly.api.dto.transacao.TransacaoResponse;
import com.coinly.api.exception.BusinessException;
import com.coinly.api.exception.ResourceNotFoundException;
import com.coinly.api.repository.TransacaoRepository;
import com.coinly.api.repository.UsuarioRepository;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class TransacaoService {
	@Autowired
    private AlunoService alunoService;
	@Autowired
    private ProfessorService professorService;
	@Autowired
    private VantagemService vantagemService;
	@Autowired
    private NotificacaoService notificacaoService;
	@Autowired
    private TransacaoRepository transacaoRepository;
	@Autowired UsuarioRepository usuarioRepository;

    @Transactional
    public void processarEnvioProfessor(String emailProfessor, EnviarMoedasRequest request) {
        Professor professor = professorService.buscarPorEmail(emailProfessor);
        if (professor.getSaldoMoedas() < request.quantidade()) {
            throw new BusinessException("Saldo insuficiente para distribuição.");
        }

        Aluno aluno = alunoService.findById(request.alunoId());

        professorService.deduzirSaldo(professor.getId(), request.quantidade());
        alunoService.adicionarSaldo(aluno.getId(), request.quantidade());

        Transacao transacao = new Transacao(professor, aluno, request.quantidade(), request.mensagem());
        transacao.setTipoOperacao(TipoOperacao.ENVIO);
        transacaoRepository.save(transacao);

        notificacaoService.notificarRecebimentoMoedas(aluno.getEmail(), aluno.getNome(), request.quantidade());
    }

    @Transactional
    public String processarResgateAluno(String emailAluno, Long vantagemId) {
        Aluno aluno = alunoService.buscarPorEmail(emailAluno);
        Vantagem vantagem = vantagemService.buscarEntidadePorId(vantagemId);

        if (aluno.getSaldoMoedas() < vantagem.getCustoMoedas()) {
            throw new BusinessException("Saldo insuficiente para resgate desta vantagem.");
        }

        alunoService.deduzirSaldo(aluno.getId(), vantagem.getCustoMoedas());
        String codigoCupom = UUID.randomUUID().toString().substring(0, 8).toUpperCase();

        Transacao troca = new Transacao(aluno, vantagem.getEmpresa(), vantagem.getCustoMoedas(), "Resgate: " + vantagem.getNome());
        troca.setTipoOperacao(TipoOperacao.RESGATE);
        troca.setCodigoCupom(codigoCupom);
        transacaoRepository.save(troca);

        notificacaoService.enviarCupomResgate(aluno.getEmail(), vantagem.getNome(), codigoCupom);
        notificacaoService.notificarParceiroResgate(vantagem.getEmpresa().getEmail(), aluno.getNome(), vantagem.getNome(), codigoCupom);

        return codigoCupom;
    }
    
    
    @Transactional
    public List<TransacaoResponse> meuExtrato(String emailUsuarioLogado) {
        Usuario usuario = usuarioRepository.findByEmail(emailUsuarioLogado)
                .orElseThrow(() -> new ResourceNotFoundException("Usuário não encontrado"));

        List<Transacao> transacoes = transacaoRepository
                .findByRemetenteOrDestinatarioOrderByDataDesc(usuario, usuario);

        return transacoes.stream().map(t -> {
            String tipo = (t.getRemetente() != null && 
                          t.getRemetente().getId().equals(usuario.getId())) 
                          ? "ENVIO" : "RESGATE";

            String origem = t.getRemetente() != null ? t.getRemetente().getNome() : "Sistema";
            String destino = t.getDestinatario() != null ? t.getDestinatario().getNome() : "Sistema";

            return new TransacaoResponse(
                t.getId(),
                t.getData(),
                t.getValor(),
                tipo,
                t.getDescricao(),
                origem,
                destino
            );
        }).toList();
    }
    
}
