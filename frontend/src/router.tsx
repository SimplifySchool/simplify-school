import { createBrowserRouter, Navigate } from 'react-router-dom'
import App from './App'
import { ProtectedRoute } from './components/ProtectedRoute'
import { AssignmentPage } from './features/assignment-tracker/AssignmentPage'
import { LandingPage } from './features/landing-page/LandingPage'
import { SchedulePage } from './features/schedule/SchedulePage'
import { StudyGroupDetailPage } from './features/study-group/StudyGroupDetailPage'
import { StudyGroupsPage } from './features/study-group/StudyGroupsPage'

export const router = createBrowserRouter([
    {
        path: '/',
        element: <App />,
        children: [
            {
                index: true,
                element: <LandingPage />,
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
                path: 'study-groups',
                element: (
                    <ProtectedRoute>
                        <StudyGroupsPage />
                    </ProtectedRoute>
                ),
            },
            {
                path: 'study-groups/:id',
                element: (
                    <ProtectedRoute>
                        <StudyGroupDetailPage />
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
