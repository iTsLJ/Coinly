import { http } from './http'
import type {
  Aluno,
  AlunoCreateRequest,
  AlunoUpdateRequest,
} from '../types/api'

const BASE = '/api/alunos'

export const alunoService = {
  listar: () => http.get<Aluno[]>(BASE),
  buscar: (id: number) => http.get<Aluno>(`${BASE}/${id}`),
  criar: (data: AlunoCreateRequest) => http.post<Aluno>(BASE, data),
  atualizar: (id: number, data: AlunoUpdateRequest) =>
    http.put<Aluno>(`${BASE}/${id}`, data),
  remover: (id: number) => http.delete<void>(`${BASE}/${id}`),
}
