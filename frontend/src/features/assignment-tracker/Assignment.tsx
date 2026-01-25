import { useState } from 'react'
import Dropdown from '../../components/Dropdown'
import Button from '../../components/Button'
import { Dialog } from '../../components/DialogBox/Dialog'
import { DialogHeader } from '../../components/DialogBox/DialogHeader'
import { DialogContent } from '../../components/DialogBox/DialogContent'
import { TextField } from '../../components/TextField'
import { DialogFooter } from '../../components/DialogBox/DialogFooter'
import type { AssignmentData, AssignmentModifiable } from './AssignmentPage'

const apiURL = import.meta.env.VITE_API_URL as string

type AssignmentStatus = 'To Do' | 'Doing' | 'Done'

interface AssignmentProps {
    id: number
    initialName: string
    desc: string
    dueDate?: string
    onDelete: () => void
}

function Assignment({
    id,
    initialName = '',
    desc = '',
    dueDate = 'No date set',
    onDelete,
}: AssignmentProps) {
    const [status, setStatus] = useState<AssignmentStatus>('To Do')
    const [visible, setVisible] = useState(false) // For the dialog box
    const [draftName, setDraftName] = useState(initialName)
    const [draftDesc, setDraftDesc] = useState(desc)
    const [assignmentName, setAssignmentName] = useState(initialName)
    const [assignmentDesc, setAssignmentDesc] = useState(desc)
    const [textError, setTextError] = useState('')
    const [descError, setDescError] = useState('')

    async function modifyAssignment(payload: AssignmentModifiable) {
        const res = await fetch(`${apiURL}/assignments/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
        })

        if (!res.ok) {
            const text = await res.text()
            throw new Error(text || 'Failed to update assignment')
        }

        const data = (await res.json()) as AssignmentData
        return data
    }

    async function saveAndExit(name: string, desc: string) {
        //Input validation!
        if (name.trim().length === 0) {
            setTextError('Invalid Assignment Name')
        } else {
            setTextError('')
        }

        if (desc.trim().length === 0) {
            setDescError('Invalid Description')
        } else {
            setDescError('')
        }

        if (textError != '' || descError != '') {
            return
        }

        const payload: AssignmentModifiable = {
            title: name,
            description: desc,
            completion_status: status,
            due_date: null,
        }

        try {
            const newAssignment = await modifyAssignment(payload)
            changeAssignmentName(newAssignment.title)
            changeAssignmentDesc(newAssignment.description)
            setStatus(newAssignment.completion_status)

            setVisible(false)
        } catch (err) {
            console.error(err)
        }
    }

    function changeDraftDesc(desc: string) {
        setDraftDesc(desc)
        if (descError != '') {
            if (draftDesc.trim() != '') {
                setDescError('')
            }
        }
    }

    function changeAssignmentDesc(desc: string) {
        setAssignmentDesc(desc.trim())
    }

    function changeDraftName(name: string) {
        setDraftName(name)
        if (textError != '') {
            if (draftName.trim() != '') {
                setTextError('')
            }
        }
    }

    function changeAssignmentName(name: string) {
        setAssignmentName(name.trim())
    }

    function showEditDialog() {
        setVisible(true)
    }

    function hideEditDialog() {
        setDraftName(assignmentName)
        setDraftDesc(assignmentDesc)
        setVisible(false)
    }

    return (
        <>
            <div className="flex items-center justify-between p-4 h-20 bg-white border rounded-4xl border-slate-200 hover:shadow-lg transition-colors shadow-xl">
                <div className="flex flex-col">
                    <span className="text-sm font-semibold text-slate-900">
                        {assignmentName}
                    </span>
                    <span className="text-xs text-slate-500">
                        Due: {dueDate}
                    </span>
                </div>

                <div className="text-sm text-slate-600">
                    <b>Desc: </b>
                    {assignmentDesc}
                </div>

                <div className="flex flex-row items-center gap-3">
                    <Dropdown
                        options={[
                            { value: 'To do', className: 'text-red-500' },
                            {
                                value: 'In-progress',
                                className: 'text-yellow-500',
                            },
                            { value: 'Done', className: 'text-green-500' },
                        ]}
                        value={status}
                        onChange={(val) => setStatus(val as AssignmentStatus)}
                    />
                    <div className="flex flex-row gap-1">
                        <Button
                            variant="outlined"
                            color="secondary"
                            size="md"
                            icon={
                                <span className="material-symbols-outlined text-black text-[20px]!">
                                    edit
                                </span>
                            }
                            iconPosition="left"
                            onClick={showEditDialog}
                        ></Button>
                        <Button
                            variant="outlined"
                            color="secondary"
                            size="md"
                            icon={
                                <span className="material-symbols-outlined text-black text-[20px]!">
                                    delete
                                </span>
                            }
                            iconPosition="left"
                            onClick={onDelete}
                        ></Button>
                    </div>
                </div>
            </div>

            <Dialog open={visible} onClose={hideEditDialog}>
                <DialogHeader
                    title={
                        <span>
                            Editing Assignment:{` `}
                            <span className="italic underline">
                                {assignmentName}
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
                            <h2 className="text-left px-2">Assignment Name</h2>
                            <TextField
                                className="w-45! focus:border-blue-400!"
                                placeholder="Name"
                                onChange={(e) =>
                                    changeDraftName(e.target.value)
                                }
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                        saveAndExit(draftName, draftDesc).catch(
                                            console.error
                                        )
                                    }
                                }}
                                error={textError}
                            ></TextField>
                        </div>
                        <div className="flex items-start flex-col gap-1">
                            <h2 className="text-left px-2">
                                Assignment Description
                            </h2>
                            <TextField
                                className="w-45! focus:border-blue-400!"
                                placeholder="Desc"
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                        saveAndExit(draftName, draftDesc).catch(
                                            console.error
                                        )
                                    }
                                }}
                                onChange={(e) =>
                                    changeDraftDesc(e.target.value)
                                }
                                error={descError}
                            ></TextField>
                        </div>
                    </div>
                </DialogContent>

                <DialogFooter>
                    <Button
                        variant="outlined"
                        className="absolute bottom-5 right-5 font-bold! text-black! "
                        onClick={() => void saveAndExit(draftName, draftDesc)}
                    >
                        Save & Exit
                    </Button>
                </DialogFooter>
            </Dialog>
        </>
    )
}

export default Assignment
