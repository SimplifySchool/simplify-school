import './App.css'
import { Dialog } from './components/DialogBox/Dialog'
import { TextField } from './components/TextField'
import Assignment from './features/assignment-tracker/Assignment'

function App() {
    function hi() {
        console.log('hi')
    }

    return (
        <>
            <h1>Hello!</h1>
            <TextField
                variant="outlined"
                className="focus:!border-blue-500"
                placeholder="Username"
            />
            <Dialog open={true} closeOnBackdropClick={true} onClose={hi}>
                WHZZUPPPPPP
            </Dialog>
        </>
    )
}

export default App
