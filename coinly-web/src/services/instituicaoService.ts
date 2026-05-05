import { http } from './http'
import type { Instituicao } from '../types/api'

const BASE = '/api/instituicoes'

export const instituicaoService = {
  listar: () => http.get<Instituicao[]>(BASE),
}
