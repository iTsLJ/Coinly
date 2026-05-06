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
 
export type EmpresaCreateRequest = {
  nomeFantasia: string
  cnpj: string
  email: string
}
 
export type StatusEmpresa = 'PENDENTE' | 'APROVADA' | 'REJEITADA'
 
export type EmpresaResponse = {
  id: number
  nomeFantasia: string
  cnpj: string
  email: string
  status: StatusEmpresa
}
 
export type LoginRequest = {
  email: string
  senha: string
}
 
export type LoginResponse = {
  token: string
  expiresAt: string
  username: string
  roles: string[]
}
 
export const coinlyApi = {
  login: (request: LoginRequest) =>
    api.post<LoginResponse>('/auth/login', request),
 
  me: () =>
    api.get<LoginResponse>('/auth/me'),
 
  listInstituicoes: () =>
    api.get<Instituicao[]>('/api/instituicoes'),
 
  createAluno: (request: AlunoCreateRequest) =>
    api.post<AlunoResponse>('/api/alunos', request),
 
  createEmpresa: (request: EmpresaCreateRequest) =>
    api.post<EmpresaResponse>('/api/empresas', request),
}
 
export const logout = () => {
  localStorage.removeItem('token')
  sessionStorage.removeItem('token')
}
 