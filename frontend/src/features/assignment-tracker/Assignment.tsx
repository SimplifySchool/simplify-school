import { useState } from 'react'
import Dropdown from '../../components/Dropdown'
import Button from '../../components/Button'

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

    return (
        <div className="flex items-center justify-between p-4 h-20 bg-white border rounded-4xl border-slate-200 hover:shadow-lg transition-colors shadow-xl">
            <div className="flex flex-col">
                <span className="text-sm font-semibold text-slate-900">
                    {initialName}
                </span>
                <span className="text-xs text-slate-500">Due: {dueDate}</span>
            </div>

            <div className="text-sm text-slate-600">
                <b>Desc: </b>
                {desc}
            </div>

            <div className="flex flex-row items-center gap-3">
                <Dropdown
                    options={[
                        { value: 'To do', className: 'text-red-500' },
                        { value: 'In-progress', className: 'text-yellow-500' },
                        { value: 'Done', className: 'text-green-500' },
                    ]}
                    value={status}
                    onChange={(val) => setStatus(val as AssignmentStatus)}
                />
                <Button
                    variant='outlined'
                    color='secondary'
                    size='md'
                    icon = {<span className="material-symbols-outlined text-black !text-[20px]">edit</span>}
                    iconPosition='left'
                >
                </Button>
            </div>
        </div>
    )
}

export default Assignment
