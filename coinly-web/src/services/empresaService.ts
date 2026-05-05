import { http } from './http'
import type {
  EmpresaCreateRequest,
  EmpresaParceira,
  EmpresaUpdateRequest,
  StatusEmpresa,
} from '../types/api'

const BASE = '/api/empresas'

export const empresaService = {
  listar: (status?: StatusEmpresa) => {
    const qs = status ? `?status=${status}` : ''
    return http.get<EmpresaParceira[]>(`${BASE}${qs}`)
  },
  buscar: (id: number) => http.get<EmpresaParceira>(`${BASE}/${id}`),
  criar: (data: EmpresaCreateRequest) =>
    http.post<EmpresaParceira>(BASE, data),
  atualizar: (id: number, data: EmpresaUpdateRequest) =>
    http.put<EmpresaParceira>(`${BASE}/${id}`, data),
  aprovar: (id: number) =>
    http.patch<EmpresaParceira>(`${BASE}/${id}/aprovar`),
  rejeitar: (id: number) =>
    http.patch<EmpresaParceira>(`${BASE}/${id}/rejeitar`),
  remover: (id: number) => http.delete<void>(`${BASE}/${id}`),
}
