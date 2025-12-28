import { useState } from 'react'
import Dropdown from '../../components/Dropdown'

type AssignmentStatus = 'To Do' | 'Doing' | 'Done'

interface AssignmentProps {
    initialName?: string
    dueDate?: string
}

function Assignment({
    initialName = 'New Assignment',
    dueDate = 'No date set',
}: AssignmentProps) {
    const [status, setStatus] = useState<AssignmentStatus>('To Do')

    return (
        <div className="flex items-center justify-between p-4 bg-white border-b border-slate-200 hover:bg-slate-50 transition-colors">
            <div className="flex flex-col">
                <span className="text-sm font-semibold text-slate-900">
                    {initialName}
                </span>
                <span className="text-xs text-slate-500">Due: {dueDate}</span>
            </div>

            <div className="flex items-center gap-3">
                <Dropdown
                    options={['To Do', 'Doing', 'Done']}
                    value={status}
                    onChange={(val) => setStatus(val as AssignmentStatus)}
                />
            </div>
        </div>
    )
}

export default Assignment
