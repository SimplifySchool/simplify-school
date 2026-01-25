import { useAuth0 } from '@auth0/auth0-react'
import { Button } from './Button'

export const LogoutButton = () => {
    const { logout } = useAuth0()

    return (
        <Button
            onClick={() => {
                logout({
                    logoutParams: { returnTo: window.location.origin },
                }).catch((err) => {
                    console.error('Logout failed:', err)
                })
            }}
            className="bg-linear-to-r from-red-600 to-red-700 text-white font-medium hover:from-red-700 hover:to-red-800 transition-all duration-200 shadow-md hover:shadow-lg"
        >
            Log Out
        </Button>
    )
}
