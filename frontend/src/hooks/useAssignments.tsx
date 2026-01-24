import { useEffect, useState } from 'react'
import type { AssignmentData } from '../features/assignment-tracker/AssignmentPage'

const apiURL = import.meta.env.VITE_API_URL as string

export function useAssignments() {
    const [assignments, setAssignments] = useState<AssignmentData[]>([])

    useEffect(() => {
        const loadAssignments = async () => {
            try {
                const res = await fetch(`${apiURL}/assignments`)
                if (!res.ok) throw new Error('Failed to fetch')

                const data = (await res.json()) as AssignmentData[]
                setAssignments(data)
            } catch (error) {
                console.log(error)
            }
        }

        loadAssignments().catch((err) => console.error(err))
    }, [])

    function replaceAssignmets(newAssignments: AssignmentData[]) {
        setAssignments(newAssignments)
    }

    function updateAssignments(newAssignment: AssignmentData) {
        if (assignments === null) {
            setAssignments([newAssignment])
        } else {
            setAssignments((prev) => [...prev, newAssignment])
        }
    }

    function deleteAssignment(id: number) {
        setAssignments((prev) => prev.filter((a) => a.id !== id))
    }

    return {
        assignments,
        updateAssignments,
        deleteAssignment,
        replaceAssignmets,
    }
}
