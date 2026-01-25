import { useAuth0 } from '@auth0/auth0-react'
import { Button } from '../../components/Button'
import { LoginButton } from '../../components/LoginButton'

interface LandingPageProps {
    sendToAssignmentsPage: () => void
}

export const LandingPage = ({ sendToAssignmentsPage }: LandingPageProps) => {
    const { isAuthenticated } = useAuth0()

    return (
        <div className="min-h-screen bg-linear-to-br from-blue-50 via-white to-purple-50">
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
                            <Button
                                onClick={sendToAssignmentsPage}
                                className="bg-linear-to-r from-blue-600 to-purple-600 text-white font-semibold hover:shadow-xl transition-all duration-200"
                            >
                                Go to Assignments
                            </Button>
                        ) : (
                            <>
                                <LoginButton />
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
