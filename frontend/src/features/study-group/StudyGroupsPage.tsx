import { useNavigate } from 'react-router-dom'
import { useStudyGroups } from '../../hooks/useStudyGroups'
import type { StudyGroupData } from '../../hooks/useStudyGroups'

export function StudyGroupsPage() {
    const { studyGroups, loading, error } = useStudyGroups()
    const navigate = useNavigate()

    function handleGroupClick(group: StudyGroupData) {
        void navigate(`/study-groups/${group.id}`)
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
            <div className="flex items-center justify-center py-20">
                <div className="bg-red-50 border border-red-200 rounded-2xl p-8 max-w-md text-center">
                    <span className="material-symbols-outlined text-red-500 text-4xl mb-3 block">
                        error
                    </span>
                    <h2 className="text-lg font-semibold text-red-800 mb-1">
                        Failed to load study groups
                    </h2>
                    <p className="text-red-600 text-sm">{error}</p>
                </div>
            </div>
        )
    }

    return (
        <div className="flex flex-col gap-8 m-5 max-w-5xl mx-auto">
            <div className="flex flex-col gap-2">
                <h1 className="text-left text-2xl font-bold bg-linear-to-r from-indigo-700 to-purple-600 bg-clip-text text-transparent">
                    Your Study Groups
                </h1>
                <p className="text-left text-gray-500 text-sm">
                    Select a study group to view members and their progress.
                </p>
            </div>

            {studyGroups.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 gap-4">
                    <span className="material-symbols-outlined text-gray-300 text-6xl">
                        group_off
                    </span>
                    <p className="text-gray-400 text-lg">
                        You're not in any study groups yet.
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                    {studyGroups.map((group) => (
                        <button
                            key={group.id}
                            id={`study-group-card-${group.id}`}
                            onClick={() => handleGroupClick(group)}
                            className="group relative flex flex-col gap-3 p-6 rounded-2xl border border-gray-200 bg-white text-left
                                       shadow-sm hover:shadow-lg hover:border-indigo-300 hover:-translate-y-1
                                       transition-all duration-200 ease-out cursor-pointer focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2"
                        >
                            {/* Subtle gradient accent bar */}
                            <div className="absolute top-0 left-6 right-6 h-0.5 rounded-b-full bg-linear-to-r from-indigo-500 to-purple-500 opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>

                            <div className="flex items-center gap-3">
                                <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-indigo-100 text-indigo-600 group-hover:bg-indigo-200 transition-colors duration-200">
                                    <span className="material-symbols-outlined text-xl">
                                        groups
                                    </span>
                                </div>
                                <h3 className="text-lg font-semibold text-gray-900 truncate">
                                    {group.name}
                                </h3>
                            </div>

                            <p className="text-sm text-gray-500 line-clamp-2 leading-relaxed">
                                {group.description || 'No description provided.'}
                            </p>

                            <div className="flex items-center justify-between mt-auto pt-3 border-t border-gray-100">
                                <span className="text-xs text-gray-400">
                                    Created{' '}
                                    {new Date(
                                        group.created_at
                                    ).toLocaleDateString('en-US', {
                                        month: 'short',
                                        day: 'numeric',
                                        year: 'numeric',
                                    })}
                                </span>
                                <span className="material-symbols-outlined text-gray-300 group-hover:text-indigo-500 transition-colors text-lg">
                                    arrow_forward
                                </span>
                            </div>
                        </button>
                    ))}
                </div>
            )}
        </div>
    )
}
