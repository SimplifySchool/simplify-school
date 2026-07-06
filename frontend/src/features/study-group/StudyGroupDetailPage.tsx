import { useNavigate, useParams } from 'react-router-dom'
import Button from '../../components/Button'
import { useStudyGroupDetail } from '../../hooks/useStudyGroupDetail'
import type { MemberData } from '../../hooks/useStudyGroupDetail'

function MemberCard({ member, isAdmin }: { member: MemberData; isAdmin: boolean }) {
    const total = member.completed_count + member.missing_count
    const completionPercent = total > 0 ? Math.round((member.completed_count / total) * 100) : 0

    return (
        <div
            id={`member-card-${member.id}`}
            className="flex flex-col gap-4 p-5 rounded-2xl border border-gray-200 bg-white shadow-sm hover:shadow-md transition-shadow duration-200"
        >
            {/* Member info row */}
            <div className="flex items-center gap-3">
                {/* Avatar circle */}
                <div className="flex items-center justify-center w-10 h-10 rounded-full bg-linear-to-br from-indigo-500 to-purple-500 text-white font-bold text-sm shrink-0">
                    {member.name
                        ? member.name
                              .split(' ')
                              .map((n) => n[0])
                              .join('')
                              .toUpperCase()
                              .slice(0, 2)
                        : '?'}
                </div>
                <div className="flex flex-col min-w-0">
                    <div className="flex items-center gap-2">
                        <span className="font-semibold text-gray-900 truncate">
                            {member.name || 'Unknown'}
                        </span>
                        {isAdmin && (
                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-amber-100 text-amber-700 tracking-wide uppercase">
                                Admin
                            </span>
                        )}
                    </div>
                    <span className="text-xs text-gray-400 truncate">
                        {member.email}
                    </span>
                </div>
            </div>

            {/* Assignment stats – laid out to leave room for future additions (e.g. stopwatch) */}
            <div className="flex flex-col gap-2">
                {/* Progress bar */}
                <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div
                        className="h-full rounded-full bg-linear-to-r from-emerald-400 to-emerald-500 transition-all duration-500 ease-out"
                        style={{ width: `${completionPercent}%` }}
                    ></div>
                </div>

                <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-1.5">
                        <span className="inline-block w-2 h-2 rounded-full bg-emerald-400"></span>
                        <span className="text-gray-600">
                            <span className="font-semibold text-emerald-600">
                                {member.completed_count}
                            </span>{' '}
                            completed
                        </span>
                    </div>
                    <div className="flex items-center gap-1.5">
                        <span className="inline-block w-2 h-2 rounded-full bg-orange-400"></span>
                        <span className="text-gray-600">
                            <span className="font-semibold text-orange-600">
                                {member.missing_count}
                            </span>{' '}
                            missing
                        </span>
                    </div>
                </div>
            </div>
        </div>
    )
}

export function StudyGroupDetailPage() {
    const { id } = useParams<{ id: string }>()
    const { groupDetail, loading, error } = useStudyGroupDetail(id)
    const navigate = useNavigate()

    function goBack() {
        void navigate('/study-groups')
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center py-20">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            </div>
        )
    }

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center py-20 gap-4">
                <div className="bg-red-50 border border-red-200 rounded-2xl p-8 max-w-md text-center">
                    <span className="material-symbols-outlined text-red-500 text-4xl mb-3 block">
                        error
                    </span>
                    <h2 className="text-lg font-semibold text-red-800 mb-1">
                        Could not load group
                    </h2>
                    <p className="text-red-600 text-sm">{error}</p>
                </div>
                <Button variant="tonal" onClick={goBack}>
                    ← Back to Study Groups
                </Button>
            </div>
        )
    }

    if (!groupDetail) return null

    return (
        <div className="flex flex-col gap-8 m-5 max-w-5xl mx-auto">
            {/* Header */}
            <div className="flex flex-col gap-4">
                <Button
                    variant="text"
                    size="sm"
                    className="self-start -ml-2 text-gray-500!"
                    onClick={goBack}
                    id="back-to-study-groups"
                >
                    ← Back to Study Groups
                </Button>

                <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
                    <div className="flex flex-col gap-1">
                        <h1 className="text-left text-2xl font-bold bg-linear-to-r from-indigo-700 to-purple-600 bg-clip-text text-transparent">
                            {groupDetail.name}
                        </h1>
                        <p className="text-left text-gray-500 text-sm">
                            {groupDetail.description || 'No description provided.'}
                        </p>
                    </div>
                    <span className="text-xs text-gray-400 whitespace-nowrap">
                        Created{' '}
                        {new Date(groupDetail.created_at).toLocaleDateString(
                            'en-US',
                            {
                                month: 'short',
                                day: 'numeric',
                                year: 'numeric',
                            }
                        )}
                    </span>
                </div>
            </div>

            {/* Members section */}
            <div className="flex flex-col gap-4">
                <div className="flex items-center gap-2 border-b border-gray-200 pb-2">
                    <span className="material-symbols-outlined text-indigo-500 text-xl">
                        people
                    </span>
                    <h2 className="text-left text-lg font-bold text-gray-900">
                        Members
                    </h2>
                    <span className="ml-1 inline-flex items-center justify-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
                        {groupDetail.members?.length ?? 0}
                    </span>
                </div>

                {!groupDetail.members || groupDetail.members.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-12 gap-3">
                        <span className="material-symbols-outlined text-gray-300 text-5xl">
                            person_off
                        </span>
                        <p className="text-gray-400">
                            No members in this group yet.
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {groupDetail.members.map((member) => (
                            <MemberCard
                                key={member.id}
                                member={member}
                                isAdmin={member.id === groupDetail.admin_id}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}
