import { useAuth0 } from '@auth0/auth0-react'
import { useEffect } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'

interface ProtectedRouteProps {
    children: React.ReactNode
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
    const { isAuthenticated, isLoading } = useAuth0()
    const navigate = useNavigate()

    useEffect(() => {
        if (!isLoading && !isAuthenticated) {
            void navigate('/', { replace: true })
        }
    }, [isAuthenticated, isLoading, navigate])

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        )
    }

    if (!isAuthenticated) {
        return <Navigate to="/" replace />
    }

    return <>{children}</>
}
