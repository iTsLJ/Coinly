const BASE = '/api/instituicoes'

export async function listarInstituicoes() {
  const res = await fetch(BASE)
  if (!res.ok) throw new Error('Erro ao listar instituições')
  return res.json()
}
