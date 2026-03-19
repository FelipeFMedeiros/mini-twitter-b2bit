import { createBrowserRouter } from 'react-router-dom'
import ProtectedRoute from './ProtectedRoute'
import PublicRoute from './PublicRoute'
import LoginPage from '@/pages/Login'
import RegisterPage from '@/pages/Register'
import HomePage from '@/pages/Home'
import NotFound from '@/pages/NotFound'

export const router = createBrowserRouter([
  // Rota Aberta (Home)
  {
    path: '/',
    element: <HomePage />,
  },

  // Rotas Protegidas (Não usei, mas deixei aqui caso eu use no futuro)
  {
    element: <ProtectedRoute />,
    children: [
      // Talvez eu use isso no futuro
    ],
  },

  // Rotas Públicas (bloqueia usuário já autenticado)
  {
    element: <PublicRoute />,
    children: [
      {
        path: '/login',
        element: <LoginPage />,
      },
      {
        path: '/register',
        element: <RegisterPage />,
      },
    ],
  },

  // Rota 404
  {
    path: '*',
    element: <NotFound />,
  },
])
