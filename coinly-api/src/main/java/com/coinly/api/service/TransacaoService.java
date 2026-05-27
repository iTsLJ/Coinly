package com.coinly.api.service;

import java.util.List;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.coinly.api.domain.Aluno;
import com.coinly.api.domain.ProcessedCommand;
import com.coinly.api.domain.Professor;
import com.coinly.api.domain.TipoOperacao;
import com.coinly.api.domain.Transacao;
import com.coinly.api.domain.Usuario;
import com.coinly.api.domain.Vantagem;
import com.coinly.api.dto.transacao.TransacaoResponse;
import com.coinly.api.exception.BusinessException;
import com.coinly.api.exception.ResourceNotFoundException;
import com.coinly.api.messaging.EnvioComandoResultado;
import com.coinly.api.messaging.EnviarMoedasCommand;
import com.coinly.api.messaging.ResgateResultado;
import com.coinly.api.repository.ProcessedCommandRepository;
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
    private TransacaoRepository transacaoRepository;
	@Autowired UsuarioRepository usuarioRepository;
	@Autowired
    private ProcessedCommandRepository processedCommandRepository;

    private static final String TIPO_COMANDO_ENVIO = "ENVIAR_MOEDAS";

    @Transactional
    public EnvioComandoResultado processarEnvioComando(EnviarMoedasCommand command) {
        if (processedCommandRepository.existsByCommandId(command.commandId())) {
            return new EnvioComandoResultado.JaProcessado();
        }

        Professor professor;
        Aluno aluno;
        try {
            professor = professorService.buscarPorEmail(command.emailProfessor());
            aluno = alunoService.findById(command.alunoId());
        } catch (ResourceNotFoundException e) {
            processedCommandRepository.save(new ProcessedCommand(command.commandId(), TIPO_COMANDO_ENVIO));
            return new EnvioComandoResultado.Falha(e.getMessage());
        }

        if (professor.getSaldoMoedas() < command.quantidade()) {
            processedCommandRepository.save(new ProcessedCommand(command.commandId(), TIPO_COMANDO_ENVIO));
            return new EnvioComandoResultado.Falha("Saldo insuficiente para distribuição.");
        }

        int saldoProfessorNovo = professor.getSaldoMoedas() - command.quantidade();
        int saldoAlunoNovo = aluno.getSaldoMoedas() + command.quantidade();

        professorService.deduzirSaldo(professor.getId(), command.quantidade());
        alunoService.adicionarSaldo(aluno.getId(), command.quantidade());

        Transacao transacao = new Transacao(professor, aluno, command.quantidade(), command.mensagem());
        transacao.setTipoOperacao(TipoOperacao.ENVIO);
        transacaoRepository.save(transacao);

        processedCommandRepository.save(new ProcessedCommand(command.commandId(), TIPO_COMANDO_ENVIO));

        return new EnvioComandoResultado.Sucesso(
                transacao.getId(),
                professor.getEmail(),
                saldoProfessorNovo,
                aluno.getEmail(),
                aluno.getNome(),
                saldoAlunoNovo
        );
    }

    @Transactional
    public ResgateResultado processarResgateAluno(String emailAluno, Long vantagemId) {
        Aluno aluno = alunoService.buscarPorEmail(emailAluno);
        Vantagem vantagem = vantagemService.buscarEntidadePorId(vantagemId);

        if (aluno.getSaldoMoedas() < vantagem.getCustoMoedas()) {
            throw new BusinessException("Saldo insuficiente para resgate desta vantagem.");
        }

        int saldoAlunoNovo = aluno.getSaldoMoedas() - vantagem.getCustoMoedas();
        alunoService.deduzirSaldo(aluno.getId(), vantagem.getCustoMoedas());
        String codigoCupom = UUID.randomUUID().toString().substring(0, 8).toUpperCase();

        Transacao troca = new Transacao(aluno, vantagem.getEmpresa(), vantagem.getCustoMoedas(), "Resgate: " + vantagem.getNome());
        troca.setTipoOperacao(TipoOperacao.RESGATE);
        troca.setCodigoCupom(codigoCupom);
        transacaoRepository.save(troca);

        // E-mails (cupom para o aluno + notificacao ao parceiro) sao enviados de forma
        // assincrona pelo consumer, a partir do evento publicado apos o commit.
        return new ResgateResultado(
                troca.getId(),
                codigoCupom,
                aluno.getEmail(),
                aluno.getNome(),
                saldoAlunoNovo,
                vantagem.getEmpresa().getEmail(),
                vantagem.getNome()
        );
    }
    
    
    @Transactional
    public List<TransacaoResponse> meuExtrato(String emailUsuarioLogado) {
        Usuario usuario = usuarioRepository.findByEmail(emailUsuarioLogado)
                .orElseThrow(() -> new ResourceNotFoundException("Usuário não encontrado"));

        List<Transacao> transacoes = transacaoRepository
                .findByRemetenteOrDestinatarioOrderByDataDesc(usuario, usuario);

        return transacoes.stream().map(t -> {
            String tipo = t.getTipoOperacao() != null ? t.getTipoOperacao().name() : "ENVIO";
            boolean entrada = t.getDestinatario() != null
                    && t.getDestinatario().getId().equals(usuario.getId());

            String origem = t.getRemetente() != null ? t.getRemetente().getNome() : "Sistema";
            String destino = t.getDestinatario() != null ? t.getDestinatario().getNome() : "Sistema";

            return new TransacaoResponse(
                t.getId(),
                t.getData(),
                t.getValor(),
                tipo,
                entrada,
                t.getDescricao(),
                origem,
                destino
            );
        }).toList();
    }
    
}
