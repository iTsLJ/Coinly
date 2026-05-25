import { useState, useEffect, useCallback } from 'react'
import { coinlyApi, type MeResponse, type LoginResponse } from '../lib/coinly'

export function useAuth() {
  const [user, setUser] = useState<MeResponse | null>(null)
  const [loading, setLoading] = useState(true)

  const loadUser = useCallback(async () => {
    try {
      const data = await coinlyApi.profile()
      setUser(data)
    } catch (error) {
      console.error('Erro ao carregar perfil:', error)
      localStorage.removeItem('token')
      setUser(null)
    } finally {
      setLoading(false)
    }
  }, [])

  const login = async (credentials: { email: string; senha: string }) => {
    const loginResponse: LoginResponse = await coinlyApi.login(credentials)
    
    localStorage.setItem('token', loginResponse.token)

    const profileData = await coinlyApi.profile()
    setUser(profileData)

    return loginResponse
  }

  const logout = () => {
    localStorage.removeItem('token')
    setUser(null)
  }

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (token) {
      loadUser()
    } else {
      setLoading(false)
    }
  }, [loadUser])

  const roles = user?.roles || []

  return {
    user,
    loading,
    isAuthenticated: !!user,
    isAluno: roles.includes('ROLE_ALUNO') || user?.tipo === 'ALUNO',
    isProfessor: roles.includes('ROLE_PROFESSOR') || user?.tipo === 'PROFESSOR',
    isEmpresa: roles.includes('ROLE_EMPRESA') || user?.tipo === 'EMPRESA',
    isAdmin: roles.includes('ROLE_ADMIN'),
    login,
    logout,
  }
}