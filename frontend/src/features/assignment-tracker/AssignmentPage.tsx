import { useEffect, useState } from 'react'
import Assignment from './Assignment'
import Button from '../../components/Button'
import { Dialog } from '../../components/DialogBox/Dialog'
import { DialogHeader } from '../../components/DialogBox/DialogHeader'
import { DialogContent } from '../../components/DialogBox/DialogContent'
import { TextField } from '../../components/TextField'
import { DialogFooter } from '../../components/DialogBox/DialogFooter'

export interface AssignmentData {
    id: number
    title: string
    description: string
    completionStatus: 'To Do' | 'Doing' | 'Done'
    dueDate: string | null
    createdAt: string
}

export function AssignmentPage() {
    const initialAssignmentName = 'My Assignment'
    const initialAssignmentDesc = 'No description has been given yet'

    const [initDialogBoxStatus, setInitDialogBoxStatus] = useState(false)
    const [draftName, setDraftName] = useState(initialAssignmentName)
    const [finalAssignmentName, setFinalAssignmentName] = useState(draftName)
    const [draftDesc, setDraftDesc] = useState(initialAssignmentDesc)
    const [finalAssignmentDesc, setFinalAssignmentDesc] = useState(draftDesc)
    const [assignmentNameError, setAssignmentNameError] = useState('')
    const [assignmentDescError, setAssignmentDescError] = useState('')
    const [assignments, setAssignments] = useState<AssignmentData[]>([])

    function hideEditDialog() {
        setInitDialogBoxStatus(false)
    }

    function showEditDialog() {
        setInitDialogBoxStatus(true)
    }

    function changeDraftName(name: string) {
        setDraftName(name.trim())
    }

    function changeDraftDesc(name: string) {
        setDraftDesc(name.trim())
    }

    /**
     * Creates the assignment with the given name and decription
     * @param name The name of the assignment
     * @returns
     */
    function saveAndExit(name: string, desc: string) {
        console.log('ran')
        if (name.trim().length === 0) {
            setAssignmentNameError('Invalid Assignment Name!')
            return
        }

        setAssignmentNameError('')
        setFinalAssignmentName(name)
        setFinalAssignmentDesc(desc)
        setAssignments((prev) => [
            ...prev,
            {
                id: Date.now(),
                title: name,
                description: desc,
                completionStatus: 'To Do',
                dueDate: null,
                createdAt: `${Date.now()}`,
            },
        ])

        hideEditDialog()
    }

    function addAssignment() {
        showEditDialog()
    }

    function removeAssignment(id: number) {
        setAssignments((prev) => prev.filter((a) => a.id !== id))
    }

    useEffect(() => {
        const loadAssignments = async () => {
            try {
                const res = await fetch('http://localhost:3000/assignments')
                if (!res.ok) throw new Error('Failed to fetch')

                const data = (await res.json()) as AssignmentData[]
                setAssignments(data)
            } catch (error) {
                console.log(error)
            }
        }

        loadAssignments().catch((err) => console.error(err))
    }, [])

    return (
        <>
            <div className="flex flex-col gap-20">
                <div className="flex flex-col gap-5">
                    <h2 className="border-b text-left text-xl font-bold">
                        Your Assignments:
                    </h2>
                    <div className="flex flex-col gap-5">
                        {assignments.map((a) => (
                            <Assignment
                                initialName={a.title}
                                desc={a.description}
                                key={a.id}
                                onDelete={() => removeAssignment(a.id)}
                            />
                        ))}

                        <Button
                            variant="tonal"
                            className="fixed bottom-4 left-4"
                            onClick={addAssignment}
                        >
                            Add
                        </Button>
                    </div>
                </div>
            </div>
            <div>
                {' '}
                {/*MAKE THIS INTO ANOTHER FILE LATER TOO LAZY RIGHT NOW */}
                <Dialog open={initDialogBoxStatus} onClose={hideEditDialog}>
                    <DialogHeader
                        title={
                            <span>
                                Editing Assignment:{` `}
                                <span className="italic underline">
                                    {initialAssignmentName}
                                </span>
                            </span>
                        }
                        titleProperties="flex text-lg font-semibold justify-start px-3"
                        underlinedSeperator={true}
                    >
                        <Button
                            variant="outlined"
                            size="sm"
                            className="absolute w-8 m-1.25 text-lg! top-0 right-0 text-black! material-symbols-outlined px-1!"
                            onClick={hideEditDialog}
                        >
                            close
                        </Button>
                    </DialogHeader>

                    <DialogContent>
                        <div className="flex flex-col items-start gap-7 my-4 mx-2">
                            <div className="flex flex-col gap-1">
                                <h2 className="text-left px-2">
                                    Assignment Name
                                </h2>
                                <TextField
                                    className="w-45! focus:border-blue-400!"
                                    placeholder="Name"
                                    onChange={(e) =>
                                        changeDraftName(e.target.value)
                                    }
                                    error={assignmentNameError}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter') {
                                            saveAndExit(draftName, draftDesc)
                                        }
                                    }}
                                ></TextField>
                            </div>
                            <div className="flex items-start flex-col gap-1">
                                <h2 className="text-left px-2">
                                    Assignment Description
                                </h2>
                                <TextField
                                    className="w-45! focus:border-blue-400!"
                                    placeholder="Desc"
                                    onChange={(e) =>
                                        changeDraftDesc(e.target.value)
                                    }
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter') {
                                            saveAndExit(draftName, draftDesc)
                                        }
                                    }}
                                ></TextField>
                            </div>
                        </div>
                    </DialogContent>

                    <DialogFooter>
                        <Button
                            variant="outlined"
                            className="absolute bottom-5 right-5 font-bold! text-black! "
                            onClick={() => saveAndExit(draftName, draftDesc)}
                        >
                            Save & Exit
                        </Button>
                    </DialogFooter>
                </Dialog>
            </div>
        </>
    )
}
