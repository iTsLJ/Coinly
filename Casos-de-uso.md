# Casos de Uso — Coinly

---

## UC-01 — Enviar Moedas

**Ator principal:** Professor

O professor, após autenticado, acessa a opção de envio de moedas. Ele seleciona o aluno destinatário, informa a quantidade de moedas e escreve uma mensagem obrigatória explicando o motivo do reconhecimento. Ao confirmar, o sistema publica um comando na fila de mensageria; o processamento desconta o saldo do professor, credita o saldo do aluno, registra a transação e dispara um e-mail de notificação ao aluno.

**Fluxo principal:**

1. O professor acessa a opção de enviar moedas.
2. O professor seleciona o aluno destinatário na lista de alunos cadastrados.
3. O professor informa a quantidade de moedas a enviar.
4. O professor escreve o motivo do reconhecimento.
5. O professor confirma o envio.
6. O sistema publica o comando de envio na fila de mensageria.
7. O sistema processa o comando: verifica o saldo do professor, desconta o valor da sua conta e credita na conta do aluno.
8. O sistema registra a transação com tipo `ENVIO`.
9. O sistema envia um e-mail notificando o aluno sobre o recebimento, informando o valor e o motivo.

**Fluxos alternativos:**

*A1 — Saldo insuficiente:* No passo 7, caso o saldo do professor seja menor que o valor informado, o sistema cancela a operação, registra a falha e retorna a mensagem "Saldo insuficiente para distribuição."

*A2 — Motivo não informado:* No passo 4, se o professor não preencher o motivo, o sistema bloqueia a confirmação e solicita o preenchimento do campo obrigatório.

*A3 — Comando duplicado:* No passo 7, se o identificador do comando já tiver sido processado anteriormente, o sistema ignora a requisição e retorna o status de já processado, garantindo idempotência.

---

## UC-02 — Consultar Extrato (Professor)

**Ator principal:** Professor

O professor, após autenticado, acessa a área de extrato para acompanhar suas movimentações. O sistema exibe o saldo disponível e a lista completa de envios já realizados no semestre, com data, aluno beneficiado, quantidade enviada e motivo. Isso permite ao professor controlar quanto já distribuiu e quanto ainda tem disponível.

**Fluxo principal:**

1. O professor acessa a opção de consultar extrato.
2. O sistema exibe o saldo atual de moedas do professor.
3. O sistema exibe a lista de transações do tipo `ENVIO` realizadas pelo professor, contendo data, nome do aluno destinatário, valor enviado e motivo informado, ordenadas da mais recente para a mais antiga.

**Fluxos alternativos:**

*A1 — Nenhum envio realizado:* No passo 3, se o professor ainda não tiver enviado moedas, o sistema exibe apenas o saldo e informa que não há transações registradas.

---

## UC-03 — Consultar Extrato (Aluno)

**Ator principal:** Aluno

O aluno, após autenticado, acessa a área de extrato para acompanhar suas moedas. O sistema exibe o saldo disponível e o histórico completo de transações, que inclui recebimentos de professores (com motivo do reconhecimento) e resgates de vantagens em empresas parceiras (com o nome da vantagem e o valor descontado).

**Fluxo principal:**

1. O aluno acessa a opção de consultar extrato.
2. O sistema exibe o saldo atual de moedas do aluno.
3. O sistema exibe a lista unificada de transações, ordenada da mais recente para a mais antiga, contendo:
   - **Recebimentos** (`ENVIO`): data, nome do professor remetente, valor recebido e motivo.
   - **Resgates** (`RESGATE`): data, nome da vantagem, nome da empresa parceira e valor descontado.

**Fluxos alternativos:**

*A1 — Nenhuma transação registrada:* No passo 3, se o aluno ainda não tiver recebido nem resgatado moedas, o sistema exibe apenas o saldo e informa que não há transações registradas.

---

## UC-04 — Cadastrar Vantagem (Empresa Parceira)

**Ator principal:** Empresa Parceira

A empresa parceira, após autenticada, acessa a área de gerenciamento de vantagens e cadastra uma nova oferta que ficará disponível para os alunos resgatarem. Para isso, informa o nome, a descrição, o custo em moedas e, opcionalmente, a URL de uma foto do produto ou benefício.

**Fluxo principal:**

1. A empresa parceira acessa a opção de cadastrar nova vantagem.
2. A empresa informa o nome da vantagem.
3. A empresa informa a descrição da vantagem.
4. A empresa informa o custo em moedas (valor mínimo: 1).
5. A empresa informa, opcionalmente, a URL de uma foto ilustrativa.
6. A empresa confirma o cadastro.
7. O sistema valida os campos obrigatórios e salva a vantagem vinculada à empresa autenticada.
8. O sistema confirma o cadastro e a vantagem passa a estar disponível para listagem pelos alunos.

**Fluxos alternativos:**

*A1 — Campo obrigatório não preenchido:* No passo 7, se nome, descrição ou custo não estiverem preenchidos, o sistema bloqueia o cadastro e indica os campos pendentes.

*A2 — Custo inválido:* No passo 7, se o custo informado for menor que 1, o sistema rejeita o cadastro e solicita um valor válido.

---

## UC-05 — Listar Vantagens (Aluno)

**Ator principal:** Aluno

O aluno, após autenticado, acessa a área de vantagens para visualizar todas as ofertas disponíveis cadastradas pelas empresas parceiras. Para cada vantagem, o sistema exibe nome, descrição, custo em moedas, foto (quando disponível) e o nome da empresa parceira responsável. O aluno pode selecionar uma vantagem para resgatá-la.

**Fluxo principal:**

1. O aluno acessa a opção de visualizar vantagens.
2. O sistema busca todas as vantagens cadastradas pelas empresas parceiras.
3. O sistema exibe a lista de vantagens, contendo nome, descrição, custo em moedas, foto e nome da empresa parceira.
4. O aluno visualiza os detalhes de uma vantagem de interesse.

**Fluxos alternativos:**

*A1 — Nenhuma vantagem disponível:* No passo 3, se não houver vantagens cadastradas, o sistema informa que não há vantagens disponíveis no momento.
