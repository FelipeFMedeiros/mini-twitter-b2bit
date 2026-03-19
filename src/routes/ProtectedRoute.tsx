import { Navigate, Outlet } from 'react-router-dom'
import { useAuthStore } from '@/store/useAuthStore'

/**
 * Rota Protegida — só permite acesso se o usuário estiver autenticado.
 * Caso contrário, redireciona para /login.
 * (Talvez eu use no futuro, melhorando esse projeto)
 */
const ProtectedRoute = () => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated)

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  return <Outlet />
}

export default ProtectedRoute
