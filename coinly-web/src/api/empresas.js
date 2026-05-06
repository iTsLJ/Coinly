const BASE = '/api/empresas'

export async function listarEmpresas(status) {
  const url = status ? `${BASE}?status=${status}` : BASE
  const res = await fetch(url)
  if (!res.ok) throw new Error('Erro ao listar empresas')
  return res.json()
}

export async function buscarEmpresa(id) {
  const res = await fetch(`${BASE}/${id}`)
  if (!res.ok) throw new Error('Empresa não encontrada')
  return res.json()
}

export async function criarEmpresa(data) {
  const res = await fetch(BASE, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  if (!res.ok) throw new Error('Erro ao criar empresa')
  return res.json()
}

export async function atualizarEmpresa(id, data) {
  const res = await fetch(`${BASE}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  if (!res.ok) throw new Error('Erro ao atualizar empresa')
  return res.json()
}

export async function aprovarEmpresa(id) {
  const res = await fetch(`${BASE}/${id}/aprovar`, { method: 'PATCH' })
  if (!res.ok) throw new Error('Erro ao aprovar empresa')
  return res.json()
}

export async function rejeitarEmpresa(id) {
  const res = await fetch(`${BASE}/${id}/rejeitar`, { method: 'PATCH' })
  if (!res.ok) throw new Error('Erro ao rejeitar empresa')
  return res.json()
}

export async function removerEmpresa(id) {
  const res = await fetch(`${BASE}/${id}`, { method: 'DELETE' })
  if (!res.ok) throw new Error('Erro ao remover empresa')
}
