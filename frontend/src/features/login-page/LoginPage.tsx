import Button from '../../components/Button'
import { TextField } from '../../components/TextField'

export function LoginPage() {
    return (
        <>
            <div className="flex flex-col items-start px-10 gap-5">
                <div className="flex flex-col items-start">
                    <h2>Username:</h2>
                    <TextField></TextField>
                </div>
                <div className="flex flex-col items-start">
                    <h2>Password:</h2>
                    <TextField></TextField>
                </div>
                <div className="flex flex-row gap-2 ">
                    <Button variant="outlined">Clear</Button>
                    <Button>Confirm</Button>
                </div>
            </div>
        </>
    )
}
