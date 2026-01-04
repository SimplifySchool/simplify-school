import { useEffect, useState } from 'react'
import Dropdown from '../../components/Dropdown'
import Button from '../../components/Button'
import { Dialog } from '../../components/DialogBox/Dialog'
import { DialogHeader } from '../../components/DialogBox/DialogHeader'
import { DialogContent } from '../../components/DialogBox/DialogContent'
import { TextField } from '../../components/TextField'
import { DialogFooter } from '../../components/DialogBox/DialogFooter'

type AssignmentStatus = 'To Do' | 'Doing' | 'Done'

interface AssignmentProps {
    initialName?: string
    desc?: string
    dueDate?: string
}

function Assignment({
    initialName = 'New Assignment',
    desc = 'There is no description provided.',
    dueDate = 'No date set',
}: AssignmentProps) {
    const [status, setStatus] = useState<AssignmentStatus>('To Do')
    const [visible, setVisible] = useState(false)
    const [draftName, setDraftName] = useState(initialName)
    const [assignmentName, setAssignmentName] = useState(initialName)
    const [textError, setTextError] = useState('')

    function saveAndExit(name: string) {
        //Input validation!
        if (name.trim().length === 0) {
            setTextError('Invalid Assignment Name')
            return
        }

        changeAssignmentName(name.trim())
        hideEditDialog()
        setTextError('')
    }

    function changeDraftName(name: string) {
        setDraftName(name.trim())
    }

    function changeAssignmentName(name: string) {
        setAssignmentName(name)
    }

    function showEditDialog() {
        setVisible(true)
    }

    function hideEditDialog() {
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
                    {desc}
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
                    <Button
                        variant="outlined"
                        color="secondary"
                        size="md"
                        icon={
                            <span className="material-symbols-outlined text-black !text-[20px]">
                                edit
                            </span>
                        }
                        iconPosition="left"
                        onClick={showEditDialog}
                    ></Button>
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
                            ></TextField>
                        </div>
                    </div>
                </DialogContent>

                <DialogFooter>
                    <Button
                        variant="outlined"
                        className="absolute bottom-5 right-5 font-bold! text-black! "
                        onClick={() => saveAndExit(draftName)}
                    >
                        Save & Exit
                    </Button>
                </DialogFooter>
            </Dialog>
        </>
    )
}

export default Assignment
