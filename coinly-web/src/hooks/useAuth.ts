import { useState, useEffect, useCallback } from 'react'
import { coinlyApi, type LoginResponse } from '../lib/coinly'

export function useAuth() {
  const [user, setUser] = useState<LoginResponse | null>(null)
  const [loading, setLoading] = useState(true)

  const loadUser = useCallback(async () => {
    try {
      const data = await coinlyApi.me()
      setUser(data)
    } catch {
      localStorage.removeItem('token')
      setUser(null)
    } finally {
      setLoading(false)
    }
  }, [])

  const login = async (credentials: { email: string; senha: string }) => {
    const response = await coinlyApi.login(credentials)
    localStorage.setItem('token', response.token)
    setUser(response) 
    return response
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

  const isAuthenticated = !!user
  const roles = user?.roles || []

  return {
    user,
    loading,
    isAuthenticated,
    isAluno: roles.includes('ROLE_ALUNO'),
    isProfessor: roles.includes('ROLE_PROFESSOR'),
    isEmpresa: roles.includes('ROLE_EMPRESA'),
    isAdmin: roles.includes('ROLE_ADMIN'),
    login,
    logout,
  }
}