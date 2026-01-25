import { useAuth0 } from '@auth0/auth0-react'

const API_URL = import.meta.env.VITE_API_URL as string

export const useApi = () => {
    const { getAccessTokenSilently, isAuthenticated } = useAuth0()

    const callApi = async (
        endpoint: string,
        options: RequestInit = {}
    ): Promise<Response> => {
        if (!isAuthenticated) {
            throw new Error('User must be authenticated to call this API')
        }

        try {
            const accessToken = await getAccessTokenSilently({
                authorizationParams: {
                    audience: import.meta.env.VITE_AUTH0_AUDIENCE as string,
                },
            })

            const response = await fetch(`${API_URL}${endpoint}`, {
                ...options,
                headers: {
                    ...options.headers,
                    Authorization: `Bearer ${accessToken}`,
                    'Content-Type': 'application/json',
                },
            })

            return response
        } catch (error) {
            console.error('API call failed:', error)
            throw error
        }
    }

    const callPublicApi = async (
        endpoint: string,
        options: RequestInit = {}
    ): Promise<Response> => {
        try {
            const response = await fetch(`${API_URL}${endpoint}`, {
                ...options,
                headers: {
                    ...options.headers,
                    'Content-Type': 'application/json',
                },
            })

            return response
        } catch (error) {
            console.error('Public API call failed:', error)
            throw error
        }
    }

    return { callApi, callPublicApi }
}
