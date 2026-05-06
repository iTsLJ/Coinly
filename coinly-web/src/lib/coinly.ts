import { api } from './api'

export type Instituicao = {
  id: number
  nome: string
  cnpj: string
  ativo: boolean
}

export type AlunoCreateRequest = {
  nome: string
  email: string
  cpf: string
  rg: string
  endereco: string
  curso: string
  instituicaoId: number
}

export type AlunoResponse = {
  id: number
  nome: string
  email: string
  cpf: string
  rg: string
  endereco: string
  curso: string
  saldoMoedas: number
  instituicaoId: number
  instituicaoNome: string
}

export const coinlyApi = {
  listInstituicoes: () => api.get<Instituicao[]>('/api/instituicoes'),
  createAluno: (request: AlunoCreateRequest) =>
    api.post<AlunoResponse>('/api/alunos', request),
}
