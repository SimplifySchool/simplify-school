import { useState } from 'react'
import Button from '../../components/Button'
import { Dialog } from '../../components/DialogBox/Dialog'
import { DialogContent } from '../../components/DialogBox/DialogContent'
import { DialogFooter } from '../../components/DialogBox/DialogFooter'
import { DialogHeader } from '../../components/DialogBox/DialogHeader'
import { TextField } from '../../components/TextField'
import { useApi } from '../../hooks/useApi'
import { useAssignments } from '../../hooks/useAssignments'
import Assignment from './Assignment'

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
    const { callApi } = useApi()

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
        const res = await callApi('/api/assignments', {
            method: 'POST',
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
        const res = await callApi(`/api/assignments/${id}`, {
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
            <div className="flex flex-col gap-20 m-5">
                <div className="flex flex-col gap-5">
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
                                    className="w-45! focus:border-blue-400!"
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
                        <Button
                            variant="outlined"
                            className="absolute bottom-5 right-5 font-bold! text-black!"
                            onClick={() =>
                                void saveAndExit(draftName, draftDesc)
                            }
                        >
                            Save & Exit
                        </Button>
                    </DialogFooter>
                </Dialog>
            </div>
        </>
    )
}
