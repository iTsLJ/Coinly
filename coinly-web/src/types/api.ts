// Tipos espelhando os DTOs do backend Spring Boot

export type StatusEmpresa = 'PENDENTE' | 'APROVADA' | 'REJEITADA'

export interface Instituicao {
  id: number
  nome: string
  cnpj: string
  ativo: boolean
}

export interface Aluno {
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

export interface AlunoCreateRequest {
  nome: string
  email: string
  cpf: string
  rg: string
  endereco: string
  curso: string
  instituicaoId: number
}

export interface AlunoUpdateRequest {
  nome: string
  email: string
  rg: string
  endereco: string
  curso: string
  instituicaoId: number
}

export interface EmpresaParceira {
  id: number
  nomeFantasia: string
  cnpj: string
  email: string
  status: StatusEmpresa
}

export interface EmpresaCreateRequest {
  nomeFantasia: string
  cnpj: string
  email: string
}

export interface EmpresaUpdateRequest {
  nomeFantasia: string
  email: string
}

// Erro padrão retornado pelo GlobalExceptionHandler
export interface ApiError {
  timestamp?: string
  status?: number
  error?: string
  message?: string
  details?: string[]
}
