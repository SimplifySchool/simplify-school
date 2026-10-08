import { useState } from 'react'
import Button from '../../components/Button'
import { Dialog } from '../../components/DialogBox/Dialog'
import { DialogContent } from '../../components/DialogBox/DialogContent'
import { DialogFooter } from '../../components/DialogBox/DialogFooter'
import { DialogHeader } from '../../components/DialogBox/DialogHeader'
import { TextField } from '../../components/TextField'
import Assignment from './Assignment'
import { useAssignments } from '../../hooks/useAssignments'

const apiURL = import.meta.env.VITE_API_URL as string

export interface AssignmentData {
    id: number
    title: string
    description: string
    completion_status: 'To Do' | 'Doing' | 'Done'
    due_date: string | null
    created_at: string
}

export interface AssignmentModifiable {
    title: string
    description: string
    completion_status: 'To Do' | 'Doing' | 'Done'
    due_date: string | null
}

export function AssignmentPage() {
    const initialAssignmentName = ''
    const initialAssignmentDesc = ''

    const [initDialogBoxStatus, setInitDialogBoxStatus] = useState(false)
    const [draftName, setDraftName] = useState(initialAssignmentName)
    const [draftDesc, setDraftDesc] = useState(initialAssignmentDesc)
    const [assignmentNameError, setAssignmentNameError] = useState('')
    const [assignmentDescError, setAssignmentDescError] = useState('')
    const { assignments, updateAssignments, deleteAssignment } =
        useAssignments()

    function hideEditDialog() {
        setDraftName('')
        setDraftDesc('')
        setInitDialogBoxStatus(false)
    }

    function showEditDialog() {
        setInitDialogBoxStatus(true)
    }

    function changeDraftName(name: string) {
        setDraftName(name)
        if (assignmentNameError !== '') {
            if (draftName.trim() !== '') {
                setAssignmentNameError('')
            }
        }
    }

    function changeDraftDesc(desc: string) {
        setDraftDesc(desc)
        if (assignmentDescError !== '') {
            if (draftDesc.trim() !== '') {
                setAssignmentDescError('')
            }
        }
    }

    async function createAssignment(
        payload: AssignmentModifiable
    ): Promise<AssignmentData> {
        const res = await fetch(`${apiURL}/assignments`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
        })

        if (!res.ok) {
            throw new Error('Failed to create assignment')
        }

        const data = (await res.json()) as AssignmentData
        return data
    }

    /**
     * Creates the assignment with the given name and description
     * @param name The name of the assignment
     * @returns
     */
    async function saveAndExit(name: string, desc: string) {
        if (name.trim().length === 0) {
            setAssignmentNameError('Invalid Assignment Name!')
        } else {
            setAssignmentNameError('')
        }

        if (desc.trim().length === 0) {
            setAssignmentDescError('Invalid Assignment Description!')
        } else {
            setAssignmentDescError('')
        }

        if (assignmentDescError != '' || assignmentNameError != '') {
            return
        }

        setDraftName('')
        setDraftDesc('')

        try {
            const newAssignment = await createAssignment({
                title: name,
                description: desc,
                completion_status: 'To Do',
                due_date: null,
            })
            updateAssignments(newAssignment)
            hideEditDialog()
        } catch (err) {
            console.error(err)
        }
    }

    function addAssignment() {
        showEditDialog()
    }

    async function removeAssignment(id: number) {
        const res = await fetch(`${apiURL}/assignments/${id}`, {
            method: 'DELETE',
        })

        if (!res.ok) {
            const text = await res.text()
            throw new Error(text || 'Failed to delete assignment')
        }

        deleteAssignment(id)
    }

    return (
        <>
            <div className="flex flex-col gap-20">
                <div className="flex flex-col gap-10">
                    <h2 className="border-b text-left text-xl font-bold">
                        Your Assignments:
                    </h2>
                    <div className="flex flex-col gap-5">
                        {assignments?.map((a) => (
                            <Assignment
                                initialName={a.title}
                                desc={a.description}
                                key={a.id}
                                onDelete={() => void removeAssignment(a.id)}
                                id={a.id}
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
                <Dialog
                    open={initDialogBoxStatus}
                    onClose={hideEditDialog}
                    backgroundColor="bg-white"
                    extraDialogBoxClassNames="w-100! h-98!"
                >
                    <DialogHeader
                        title={
                            <span>
                                Creating Assignment:{` `}
                                <span className="italic underline">
                                    {initialAssignmentName}
                                </span>
                            </span>
                        }
                        titleProperties="flex text-lg font-semibold justify-center"
                        underlinedSeperator={false}
                    >
                        <Button
                            variant="outlined"
                            size="sm"
                            className="absolute w-8 m-1.25 text-lg! top-0 border-0 right-0 text-black! material-symbols-outlined px-1! hover:bg-transparent"
                            onClick={hideEditDialog}
                        >
                            close
                        </Button>
                    </DialogHeader>

                    <DialogContent extraClassNames="px-0!">
                        <div className="flex flex-col items-start gap-4 my-4 mx-5">
                            <div className="flex flex-col gap-1">
                                <h2 className="text-left px-2">
                                    Assignment Name
                                </h2>
                                <TextField
                                    variant="outlined"
                                    className="w-90! focus:border-blue-400! shadow-md"
                                    placeholder="Name"
                                    onChange={(e) =>
                                        changeDraftName(e.target.value)
                                    }
                                    error={assignmentNameError}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter') {
                                            saveAndExit(
                                                draftName,
                                                draftDesc
                                            ).catch(console.error)
                                        }
                                    }}
                                ></TextField>
                            </div>
                            <div className="flex items-start flex-col gap-1">
                                <h2 className="text-left px-2">
                                    Assignment Description
                                </h2>
                                <TextField
                                    variant="outlined"
                                    className="w-90! focus:border-blue-400! shadow-md"
                                    placeholder="Desc"
                                    onChange={(e) =>
                                        changeDraftDesc(e.target.value)
                                    }
                                    error={assignmentDescError}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter') {
                                            saveAndExit(
                                                draftName,
                                                draftDesc
                                            ).catch(console.error)
                                        }
                                    }}
                                ></TextField>
                            </div>
                        </div>
                    </DialogContent>

                    <DialogFooter>
                        <div className="absolute flex justify-center w-full bg-amber-0 px-4 flex-row gap-3 right-0 bottom-5">
                            <Button
                                variant="outlined"
                                className="grow font-bold! text-black!"
                                onClick={hideEditDialog}
                            >
                                Cancel
                            </Button>
                            <Button
                                variant="contained"
                                className="text-white! grow bg-blue-500! hover:bg-blue-600! font-bold! text-black!"
                                onClick={() =>
                                    void saveAndExit(draftName, draftDesc)
                                }
                            >
                                Save
                            </Button>
                        </div>
                    </DialogFooter>
                </Dialog>
            </div>
        </>
    )
}
