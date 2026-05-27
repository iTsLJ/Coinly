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
export type MeResponse = {
  id: number;
  alunoId?: number;
  professorId?: number;
  empresaId?: number;
  nome: string;
  email: string;
  roles: string[];
  tipo: 'ALUNO' | 'PROFESSOR' | 'EMPRESA';
};
export type EnviarMoedasResponse = {
  commandId: string
  status: 'EM_PROCESSAMENTO'
}

export type ResgatarVantagemResponse = {
  cupom: string
}

export type TransacaoResponse = {
  id: number
  data: string
  valor: number
  tipo: 'ENVIO' | 'RESGATE'
  entrada: boolean
  descricao: string
  origem: string
  destino: string
}

export type VantagemResponse = {
  id: number
  nome: string
  descricao: string
  custoMoedas: number
  fotoUrl?: string
  empresaNome: string
}
export type VantagemRequest = {
  nome: string;
  descricao: string;
  fotoUrl?: string;
  custoMoedas: number;
};

export const coinlyApi = {
  login: (request: LoginRequest) =>
    api.post<LoginResponse>('/auth/login', request),

  me: () => api.get<LoginResponse>('/auth/me'),
  profile: () => api.get<MeResponse>('/auth/profile'),
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
    quantidade: number,
    mensagem: string
  ) =>
    api.post<EnviarMoedasResponse>('/api/transacoes/enviar-moedas', {
      alunoId,
      quantidade,
      mensagem,
    }),

  resgatarVantagem: (vantagemId: number) =>
    api.post<ResgatarVantagemResponse>('/api/transacoes/resgatar-vantagem', {
      vantagemId,
    }),

  listarVantagens: () => 
    api.get<VantagemResponse[]>('/api/vantagens'),
  listarMinhasVantagens: () =>
  api.get<VantagemResponse[]>('/api/vantagens/minhas'),


  criarVantagem: (request: VantagemRequest) =>
    api.post<VantagemResponse>('/api/vantagens', request),

  deletarVantagem: (id: number) =>
    api.delete<void>(`/api/vantagens/${id}`),
  

  getExtrato: () =>
    api.get<TransacaoResponse[]>('/api/transacoes/meu-extrato'),

  getAlunoById: (id: number) => api.get<any>(`/api/alunos/${id}`),
getProfessorById: (id: number) => api.get<any>(`/api/professores/${id}`),
getEmpresaById: (id: number) => api.get<any>(`/api/empresas/${id}`),

}