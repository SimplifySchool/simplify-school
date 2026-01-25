import { useAuth0 } from '@auth0/auth0-react'
import { useEffect } from 'react'
import { Outlet, useNavigate } from 'react-router-dom'
import './App.css'
import Button from './components/Button'
import { LoginButton } from './components/LoginButton'
import { LogoutButton } from './components/LogoutButton'
import { Profile } from './components/Profile'
import { useApi } from './hooks/useApi'

function App() {
    const navigate = useNavigate()

    function sendToHomePage() {
        void navigate('/')
    }

    function sendToSchedulePage() {
        if (!isAuthenticated) {
            void navigate('/')
            return
        }
        void navigate('/schedule')
    }

    function sendToAssignmentsPage() {
        if (!isAuthenticated) {
            void navigate('/')
            return
        }
        void navigate('/assignments')
    }

    const { isAuthenticated, isLoading, error, user } = useAuth0()
    const { callApi } = useApi()

    // Sync user to backend database when authenticated
    useEffect(() => {
        const syncUser = async () => {
            if (isAuthenticated && user) {
                try {
                    await callApi('/api/users/sync', {
                        method: 'POST',
                        body: JSON.stringify({
                            auth0_id: user.sub,
                            email: user.email,
                            name: user.name,
                        }),
                    })
                } catch (error) {
                    console.error('Failed to sync user:', error)
                }
            }
        }

        syncUser().catch((err) => {
            console.error('Error in syncUser:', err)
        })
    }, [isAuthenticated, user, callApi])

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-blue-50 via-white to-purple-50">
                <div className="text-center">
                    <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
                    <p className="text-lg text-gray-600">Loading...</p>
                </div>
            </div>
        )
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-red-50 via-white to-orange-50">
                <div className="max-w-md bg-white rounded-xl shadow-lg p-8">
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">
                        Authentication Error
                    </h2>
                    <p className="text-gray-600 mb-4">{error.message}</p>
                    <button
                        onClick={() => window.location.reload()}
                        className="w-full px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        Reload Page
                    </button>
                </div>
            </div>
        )
    }

    return (
        <div className="flex flex-col gap-7.5">
            {/* Header */}
            <header className="w-full border-b border-gray-200 sticky top-0 z-10 backdrop-blur-sm bg-white/90">
                <div className="w-full px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        <div className="flex items-center space-x-3">
                            <button
                                className="text-2xl font-bold bg-linear-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"
                                onClick={sendToHomePage}
                            >
                                SimplifySchool
                            </button>
                        </div>
                        <div className="flex items-center gap-4">
                            {isAuthenticated ? (
                                <>
                                    <Button
                                        variant="tonal"
                                        onClick={sendToAssignmentsPage}
                                    >
                                        Assignments
                                    </Button>
                                    <Button
                                        variant="tonal"
                                        onClick={sendToSchedulePage}
                                        color="primary"
                                    >
                                        Schedule
                                    </Button>
                                    <Profile />
                                    <LogoutButton />
                                </>
                            ) : (
                                <LoginButton />
                            )}
                        </div>
                    </div>
                </div>
            </header>
            <Outlet />
        </div>
    )
}

export default App
