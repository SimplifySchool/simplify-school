import { useAuth0 } from '@auth0/auth0-react'

export const Profile = () => {
    const { user, isAuthenticated, isLoading } = useAuth0()

    if (isLoading) {
        return (
            <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gray-200 rounded-full animate-pulse"></div>
                <div className="hidden md:block">
                    <div className="w-24 h-4 bg-gray-200 rounded animate-pulse mb-1"></div>
                    <div className="w-32 h-3 bg-gray-200 rounded animate-pulse"></div>
                </div>
            </div>
        )
    }

    if (!isAuthenticated || !user) {
        return null
    }

    return (
        <div className="flex items-center gap-3 px-3 py-2 rounded-lg bg-gray-50 border border-gray-200">
            <div className="hidden md:block">
                <p className="font-semibold text-gray-900 text-sm leading-tight">
                    {user.name}
                </p>
                <p className="text-xs text-gray-600 leading-tight">
                    {user.email}
                </p>
            </div>
        </div>
    )
}
