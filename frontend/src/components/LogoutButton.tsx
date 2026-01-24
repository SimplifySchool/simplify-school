import { useAuth0 } from '@auth0/auth0-react'

export const LogoutButton = () => {
    const { logout } = useAuth0()

    return (
        <button
            onClick={() => {
                logout({
                    logoutParams: { returnTo: window.location.origin },
                }).catch((err) => {
                    console.error('Logout failed:', err)
                })
            }}
            className="px-6 py-2.5 bg-linear-to-r from-red-600 to-red-700 text-white font-medium rounded-lg hover:from-red-700 hover:to-red-800 transition-all duration-200 shadow-md hover:shadow-lg"
        >
            Log Out
        </button>
    )
}
