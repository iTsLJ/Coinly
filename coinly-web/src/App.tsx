import { Navigate, Route, Routes } from 'react-router-dom'
import { Layout } from './components/Layout'
import { HomePage } from './pages/HomePage'
import { AlunosPage } from './pages/alunos/AlunosPage'
import { EmpresasPage } from './pages/empresas/EmpresasPage'

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<HomePage />} />
        <Route path="/alunos" element={<AlunosPage />} />
        <Route path="/empresas" element={<EmpresasPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  )
}
