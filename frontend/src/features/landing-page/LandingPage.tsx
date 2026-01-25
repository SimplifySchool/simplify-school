import { useAuth0 } from '@auth0/auth0-react'
import { LoginButton } from '../../components/LoginButton'
import { LogoutButton } from '../../components/LogoutButton'
import { Profile } from '../../components/Profile'

export const LandingPage = () => {
    const { isAuthenticated } = useAuth0()

    return (
        <div className="min-h-screen bg-linear-to-br from-blue-50 via-white to-purple-50">
            {/* Header */}
            <header className="w-full border-b border-gray-200 sticky top-0 z-10 backdrop-blur-sm bg-white/90">
                <div className="w-full px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        <div className="flex items-center space-x-3">
                            <h1 className="text-2xl font-bold bg-linear-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                                SimplifySchool
                            </h1>
                        </div>
                        <div className="flex items-center gap-4">
                            {isAuthenticated ? (
                                <>
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

            {/* Hero Section */}
            <main
                style={{ minHeight: 'calc(100vh - 4rem)' }}
                className="w-full px-4 sm:px-6 lg:px-8 py-16 md:py-24 flex flex-col justify-center"
            >
                <div className="text-center mb-16">
                    <h2 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
                        Simplify Your School
                        <span className="block bg-linear-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                            Management
                        </span>
                    </h2>
                    <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto">
                        Track assignments, manage deadlines, and stay organized
                        with our intuitive platform built for students and
                        educators.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        {isAuthenticated ? (
                            <button className="px-8 py-4 bg-linear-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-200">
                                Go to Dashboard
                            </button>
                        ) : (
                            <>
                                <LoginButton />
                                <button className="px-8 py-4 bg-white text-blue-600 font-semibold rounded-lg shadow-md hover:shadow-xl transition-all duration-200 border-2 border-blue-600">
                                    Learn More
                                </button>
                            </>
                        )}
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
                    <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-100 hover:shadow-xl transition-shadow">
                        <div className="text-5xl mb-4">📚</div>
                        <h3 className="text-2xl font-bold text-gray-900 mb-3">
                            Assignment Tracking
                        </h3>
                        <p className="text-gray-600">
                            Keep track of all your assignments in one place.
                            Never miss a deadline again with our smart reminder
                            system.
                        </p>
                    </div>

                    <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-100 hover:shadow-xl transition-shadow">
                        <div className="text-5xl mb-4">🎯</div>
                        <h3 className="text-2xl font-bold text-gray-900 mb-3">
                            Progress Monitoring
                        </h3>
                        <p className="text-gray-600">
                            Visualize your progress with intuitive dashboards
                            and stay motivated throughout the semester.
                        </p>
                    </div>

                    <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-100 hover:shadow-xl transition-shadow">
                        <div className="text-5xl mb-4">🔒</div>
                        <h3 className="text-2xl font-bold text-gray-900 mb-3">
                            Secure & Private
                        </h3>
                        <p className="text-gray-600">
                            Your data is protected with enterprise-grade
                            security powered by Auth0 authentication.
                        </p>
                    </div>
                </div>

                {/* Stats Section */}
                <div className="bg-linear-to-r from-blue-600 to-purple-600 rounded-2xl shadow-2xl p-12 text-white">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
                        <div>
                            <div className="text-5xl font-bold mb-2">Fast</div>
                            <p className="text-blue-100">
                                Lightning-fast performance
                            </p>
                        </div>
                        <div>
                            <div className="text-5xl font-bold mb-2">
                                Secure
                            </div>
                            <p className="text-purple-100">
                                Enterprise-grade security
                            </p>
                        </div>
                        <div>
                            <div className="text-5xl font-bold mb-2">
                                Simple
                            </div>
                            <p className="text-blue-100">
                                Easy to use interface
                            </p>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    )
}
