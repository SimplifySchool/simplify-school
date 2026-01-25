import { useEffect, useState } from 'react'
import type { AssignmentData } from '../features/assignment-tracker/AssignmentPage'
import { useApi } from './useApi'

export function useAssignments() {
    const [assignments, setAssignments] = useState<AssignmentData[]>([])
    const [error, setError] = useState<string | null>(null)
    const { callApi } = useApi()

    useEffect(() => {
        const loadAssignments = async () => {
            try {
                const res = await callApi('/api/assignments')
                if (!res.ok) throw new Error(`Failed to fetch: ${res.status}`)

                const data = (await res.json()) as AssignmentData[]
                setAssignments(data)
            } catch (error) {
                if (error instanceof Error) {
                    setError(error.message)
                } else {
                    setError('Something went wrong')
                }
            }
        }

        loadAssignments().catch((err) => console.error(err))
    }, [callApi])

    function replaceAssignments(newAssignments: AssignmentData[]) {
        setAssignments(newAssignments)
    }

    function updateAssignments(newAssignment: AssignmentData) {
        if (assignments.length == 0) {
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
        replaceAssignments,
        error, // The error is being returned so it can be displayed to the user correctly
    }
}
