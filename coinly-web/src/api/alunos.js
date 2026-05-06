const BASE = '/api/alunos'

export async function listarAlunos() {
  const res = await fetch(BASE)
  if (!res.ok) throw new Error('Erro ao listar alunos')
  return res.json()
}

export async function buscarAluno(id) {
  const res = await fetch(`${BASE}/${id}`)
  if (!res.ok) throw new Error('Aluno não encontrado')
  return res.json()
}

export async function criarAluno(data) {
  const res = await fetch(BASE, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  if (!res.ok) throw new Error('Erro ao criar aluno')
  return res.json()
}

export async function atualizarAluno(id, data) {
  const res = await fetch(`${BASE}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  if (!res.ok) throw new Error('Erro ao atualizar aluno')
  return res.json()
}

export async function removerAluno(id) {
  const res = await fetch(`${BASE}/${id}`, { method: 'DELETE' })
  if (!res.ok) throw new Error('Erro ao remover aluno')
}
