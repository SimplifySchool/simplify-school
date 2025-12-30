import { useState } from 'react'
import Dropdown from '../../components/Dropdown'

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
        <div className="flex items-center justify-between p-4 h-18 bg-white border rounded-4xl border-slate-200 hover:shadow-md transition-colors shadow-sm">
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

            <div className="flex items-center gap-3">
                <Dropdown
                    options={[
                        { value: 'To Do', className: 'text-red-500' },
                        { value: 'Doing', className: 'text-yellow-500' },
                        { value: 'Done', className: 'text-green-500' },
                    ]}
                    value={status}
                    onChange={(val) => setStatus(val as AssignmentStatus)}
                />
            </div>
        </div>
    )
}

export default Assignment
