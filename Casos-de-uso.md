# Casos de Uso — Coinly

## UC-01 — Enviar Moedas

**Ator principal:** Professor

O professor, após autenticado no sistema, acessa a opção de envio de moedas para reconhecer um aluno. Ele seleciona o aluno destinatário, informa a quantidade de moedas e escreve uma mensagem explicando o motivo do reconhecimento. Ao confirmar, o sistema verifica se há saldo suficiente, desconta o valor da conta do professor, credita na conta do aluno, registra a transação e dispara um e-mail notificando o aluno sobre o recebimento.

**Fluxo principal:**
1. O professor acessa a opção de enviar moedas.
2. O professor seleciona o aluno destinatário.
3. O professor informa a quantidade de moedas a enviar.
4. O professor escreve o motivo do reconhecimento.
5. O professor confirma o envio.
6. O sistema desconta as moedas do saldo do professor e adiciona ao saldo do aluno.
7. O sistema registra a transação.
8. O sistema envia um e-mail notificando o aluno sobre o recebimento.

**Fluxos alternativos:**

*A1 — Saldo insuficiente:* No passo 6, caso o saldo do professor seja menor que o valor informado, o sistema exibe a mensagem "Saldo insuficiente" e cancela a operação.

*A2 — Motivo não informado:* No passo 4, se o professor não preencher o motivo, o sistema bloqueia a confirmação e solicita o preenchimento do campo.

---

## UC-02 — Consultar Extrato (Professor)

**Ator principal:** Professor

O professor, após autenticado, acessa a área de extrato para acompanhar suas movimentações de moedas. O sistema apresenta o saldo disponível e a lista completa de envios já realizados, contendo data, aluno beneficiado, quantidade enviada e motivo informado. Essa consulta permite que o professor controle quanto já distribuiu no semestre e quanto ainda tem disponível para reconhecer outros alunos.

**Fluxo principal:**
1. O professor acessa a opção de consultar extrato.
2. O sistema exibe o saldo atual de moedas do professor.
3. O sistema exibe a lista de envios realizados, contendo data, aluno destinatário, valor e motivo.

**Fluxos alternativos:**

*A1 — Nenhum envio realizado:* No passo 3, se o professor ainda não tiver enviado moedas, o sistema exibe apenas o saldo e informa que não há transações registradas.

---

## UC-03 — Consultar Extrato (Aluno)

**Ator principal:** Aluno

O aluno, após autenticado, acessa a área de extrato para acompanhar suas moedas. O sistema mostra o saldo disponível e o histórico completo de transações, que inclui tanto os recebimentos vindos dos professores (com o motivo do reconhecimento) quanto as trocas realizadas por vantagens em empresas parceiras (com a vantagem escolhida e o valor descontado). Dessa forma, o aluno consegue visualizar de onde vieram suas moedas e em que ele já as utilizou.

**Fluxo principal:**
1. O aluno acessa a opção de consultar extrato.
2. O sistema exibe o saldo atual de moedas do aluno.
3. O sistema exibe a lista de transações, incluindo recebimentos de professores (com data, professor remetente, valor e motivo) e trocas por vantagens (com data, vantagem, empresa parceira e valor descontado).

**Fluxos alternativos:**

*A1 — Nenhuma transação registrada:* No passo 3, se o aluno ainda não tiver recebido nem trocado moedas, o sistema exibe apenas o saldo e informa que não há transações registradas.
