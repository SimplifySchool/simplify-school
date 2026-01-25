import { createBrowserRouter, Navigate, useNavigate } from 'react-router-dom'
import App from './App'
import { ProtectedRoute } from './components/ProtectedRoute'
import { AssignmentPage } from './features/assignment-tracker/AssignmentPage'
import { LandingPage } from './features/landing-page/LandingPage'
import { SchedulePage } from './features/schedule/SchedulePage'

export const router = createBrowserRouter([
    {
        path: '/',
        element: <App />,
        children: [
            {
                index: true,
                element: (
                    <LandingPage
                        sendToAssignmentsPage={() => {
                            const navigate = useNavigate()
                            void navigate('/assignments')
                        }}
                    />
                ),
            },
            {
                path: 'assignments',
                element: (
                    <ProtectedRoute>
                        <AssignmentPage />
                    </ProtectedRoute>
                ),
            },
            {
                path: 'schedule',
                element: (
                    <ProtectedRoute>
                        <SchedulePage />
                    </ProtectedRoute>
                ),
            },
            {
                path: '*',
                element: <Navigate to="/" replace />,
            },
        ],
    },
])
