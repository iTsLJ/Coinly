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

export type ProfessorCreateRequest = {
  nome: string
  email: string
  cpf: string
  departamento: string
  instituicaoId: number
}

export type ProfessorUpdateRequest = {
  nome: string
  email: string
  departamento: string
  instituicaoId: number
}

export type ProfessorResponse = {
  id: number
  nome: string
  email: string
  cpf: string
  departamento: string
  saldoMoedas: number
  ativo: boolean
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

export type TransacaoResponse = {
  id: number
  data: string
  valor: number
  tipo: 'ENVIO' | 'RESGATE'
  descricao: string
  origem: string
  destino: string
}

export type VantagemResponse = {
  id: number
  nome: string
  descricao: string
  custo: number
  fotoUrl?: string
  empresaNome: string
}

export const coinlyApi = {
  login: (request: LoginRequest) =>
    api.post<LoginResponse>('/auth/login', request),

  me: () => api.get<LoginResponse>('/auth/me'),

  listInstituicoes: () =>
    api.get<Instituicao[]>('/api/instituicoes'),

  createAluno: (request: AlunoCreateRequest) =>
    api.post<AlunoResponse>('/api/alunos', request),

  listarAlunos: () =>
    api.get<AlunoResponse[]>('/api/alunos'),

  createProfessor: (request: ProfessorCreateRequest) =>
    api.post<ProfessorResponse>('/api/professores', request),

  listarProfessores: () =>
    api.get<ProfessorResponse[]>('/api/professores'),

  atualizarProfessor: (
    id: number,
    request: ProfessorUpdateRequest
  ) =>
    api.put<ProfessorResponse>(`/api/professores/${id}`, request),

  desativarProfessor: (id: number) =>
    api.delete<ProfessorResponse>(`/api/professores/${id}`),

  createEmpresa: (request: EmpresaCreateRequest) =>
    api.post<EmpresaResponse>('/api/empresas', request),

  enviarMoedas: (
    alunoId: number,
    valor: number,
    motivo: string
  ) =>
    api.post('/api/transacoes/enviar-moedas', {
      alunoId,
      valor,
      motivo,
    }),

  resgatarVantagem: (vantagemId: number) =>
    api.post<string>('/api/transacoes/resgatar-vantagem', {
      vantagemId,
    }),

  listarVantagens: () =>
    api.get<VantagemResponse[]>('/api/vantagens'),

  getExtrato: () =>
    api.get<TransacaoResponse[]>('/api/transacoes/meu-extrato'),
}