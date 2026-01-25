import { useState } from 'react'
import './App.css'
import Button from './components/Button'
import { AssignmentPage } from './features/assignment-tracker/AssignmentPage'
import { SchedulePage } from './features/schedule/SchedulePage'

type onePage = 'homepage' | 'schedule' | 'assignments'

function App() {
    const DEFAULT_PAGE = 'homepage' as onePage

    const [page, setPage] = useState(DEFAULT_PAGE)

    function sendToHomePage() {
        setPage('homepage' as onePage)
    }

    function getTempHomePage() {
        return (
            <>
                <div className="">Welcome to the homepage</div>
            </>
        )
    }

    function sendToSchedulePage() {
        setPage('schedule' as onePage)
    }

    function sendToAssignmentsPage() {
        setPage('assignments' as onePage)
    }

    function renderPage() {
        switch (page) {
            case 'assignments':
                return <AssignmentPage />
            case 'homepage':
                return getTempHomePage()
            case 'schedule':
                return <SchedulePage />
        }
    }

    return (
        <>
            <div className="flex flex-col gap-7.5">
                <div className="flex flex-row gap-5">
                    <Button
                        variant="outlined"
                        className="text-black!"
                        onClick={sendToHomePage}
                    >
                        Home
                    </Button>
                    <Button
                        variant="outlined"
                        className="text-black!"
                        onClick={sendToSchedulePage}
                    >
                        Schedule
                    </Button>
                    <Button
                        variant="outlined"
                        className="text-black!"
                        onClick={sendToAssignmentsPage}
                    >
                        Assignments
                    </Button>
                    <Button variant="outlined" className="text-black!">
                        Logout
                    </Button>
                </div>
                {renderPage()}
            </div>
        </>
    )
}

export default App
