import { useSelector } from 'react-redux';
import { Navigate, Outlet } from 'react-router-dom';

export const ProtectedRoute = () => {
    const { token, isLoading } = useSelector((state) => state.auth);

    if (isLoading) {
        return (
            <div className="flex min-h-screen items-center justify-center text-white">
                Загрузка...
            </div>
        );
    }

    if (!token) {
        return <Navigate to='/login' replace />;
    }

    return <Outlet />;
};