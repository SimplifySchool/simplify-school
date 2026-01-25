import { useAuth0 } from '@auth0/auth0-react'
import { Button } from './Button'

export const LoginButton = () => {
    const { loginWithRedirect } = useAuth0()

    const handleLogin = () => {
        loginWithRedirect().catch((err) => {
            console.error('Login failed:', err)
        })
    }

    return (
        <Button
            onClick={handleLogin}
            className="bg-linear-to-r from-blue-600 to-blue-700 text-white font-medium hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-md hover:shadow-lg"
        >
            Log In
        </Button>
    )
}
