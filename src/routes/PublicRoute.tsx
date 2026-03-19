import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '@/store/useAuthStore';

/**
 * Rota Pública — bloqueia o acesso de usuários JÁ autenticados
 * às páginas de Login e Registro, redirecionando-os para a Home.
 */
const PublicRoute = () => {
    const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

    if (isAuthenticated) {
        return <Navigate to="/" replace />;
    }

    return <Outlet />;
};

export default PublicRoute;
