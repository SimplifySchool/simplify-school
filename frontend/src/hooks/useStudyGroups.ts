import { useCallback, useEffect, useState } from 'react'
import { useApi } from './useApi'

export interface StudyGroupData {
    id: number
    name: string
    description: string
    created_at: string
    admin_id: number
}

export function useStudyGroups() {
    const [studyGroups, setStudyGroups] = useState<StudyGroupData[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const { callApi } = useApi()

    const loadGroups = useCallback(async () => {
        try {
            setLoading(true)
            const res = await callApi('/api/study-groups')
            if (!res.ok) throw new Error(`Failed to fetch: ${res.status}`)

            const data = (await res.json()) as StudyGroupData[]
            setStudyGroups(data)
        } catch (error) {
            if (error instanceof Error) {
                setError(error.message)
            } else {
                setError('Something went wrong')
            }
        } finally {
            setLoading(false)
        }
    }, [callApi])

    useEffect(() => {
        loadGroups().catch((err) => console.error(err))
    }, [loadGroups])

    return {
        studyGroups,
        loading,
        error,
    }
}
