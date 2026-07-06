import { useCallback, useEffect, useState } from 'react'
import { useApi } from './useApi'

export interface MemberData {
    id: number
    name: string
    email: string
    completed_count: number
    missing_count: number
}

export interface StudyGroupDetailData {
    id: number
    name: string
    description: string
    created_at: string
    admin_id: number
    members: MemberData[]
}

export function useStudyGroupDetail(groupId: string | undefined) {
    const [groupDetail, setGroupDetail] = useState<StudyGroupDetailData | null>(
        null
    )
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const { callApi } = useApi()

    const loadDetail = useCallback(async () => {
        if (!groupId) return

        try {
            setLoading(true)
            const res = await callApi(`/api/study-groups/${groupId}`)
            if (!res.ok) {
                if (res.status === 403) {
                    throw new Error('You are not a member of this study group')
                }
                throw new Error(`Failed to fetch: ${res.status}`)
            }

            const data = (await res.json()) as StudyGroupDetailData
            setGroupDetail(data)
        } catch (error) {
            if (error instanceof Error) {
                setError(error.message)
            } else {
                setError('Something went wrong')
            }
        } finally {
            setLoading(false)
        }
    }, [callApi, groupId])

    useEffect(() => {
        loadDetail().catch((err) => console.error(err))
    }, [loadDetail])

    return {
        groupDetail,
        loading,
        error,
    }
}
