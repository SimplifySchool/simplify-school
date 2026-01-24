import { useAuth0 } from '@auth0/auth0-react'

export const LoginButton = () => {
    const { loginWithRedirect } = useAuth0()

    const handleLogin = () => {
        loginWithRedirect().catch((err) => {
            console.error('Login failed:', err)
        })
    }

    return (
        <button
            onClick={handleLogin}
            className="px-6 py-2.5 bg-linear-to-r from-blue-600 to-blue-700 text-white font-medium rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-md hover:shadow-lg"
        >
            Log In
        </button>
    )
}
