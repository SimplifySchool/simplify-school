import { useState } from 'react'
import './App.css'
import Button from './components/Button'
import { AssignmentPage } from './features/assignment-tracker/AssignmentPage'

function App() {
    const [page, setPage] = useState(<AssignmentPage />)

    function sendToHomePage() {
        setPage(
            <>
                <div className="">Welcome to the homepage</div>
            </>
        )
    }

    function sendToSchedulePage() {
        setPage(
            <>
                <div className="">Welcome to your schedule</div>
            </>
        )
    }
    function sendToAssignmentsPage() {
        setPage(<AssignmentPage />)
    }

    return (
        <>
            <div className="flex flex-col gap-20">
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
                {page}
            </div>
        </>
    )
}

export default App
