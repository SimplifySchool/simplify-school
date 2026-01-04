import { useState } from 'react'
import Assignment from './Assignment'
import Button from '../../components/Button'

interface AssignmentData {
    id: number
}

export function AssignmentPage() {
    const [assignments, setAssignments] = useState<AssignmentData[]>([
        { id: 0 },
    ])
    function addAssignment() {
        setAssignments((prev) => [...prev, { id: Date.now() }])
    }
    function removeAssignment(id: number) {
        setAssignments((prev) => prev.filter((a) => a.id !== id))
    }

    return (
        <div className="flex flex-col gap-5">
            {assignments.map((a) => (
                <Assignment
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
    )
}
