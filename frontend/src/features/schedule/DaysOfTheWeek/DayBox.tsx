import { isToday } from 'date-fns'
import type { AssignmentData } from '../../assignment-tracker/AssignmentPage'

export interface DayBoxProps {
    num: number
    isCurrentMonth?: boolean
    date: Date
    onClick: React.MouseEventHandler<HTMLDivElement>
    assignments: AssignmentData[]
}

export function DayBox({
    num,
    isCurrentMonth = true,
    date,
    onClick,
    assignments,
}: DayBoxProps) {
    const isTodayBox = isToday(date)

    return (
        <div
            onClick={onClick}
            className={`flex flex-col text-left text-3xl pl-2 pt-1 border-2 w-auto h-43 transition-colors cursor-pointer overflow-y-auto ${
                isTodayBox
                    ? 'bg-blue-200 hover:bg-[#D3D3D3]'
                    : 'bg-white hover:bg-[#D3D3D3]'
            }  ${isCurrentMonth ? '' : 'opacity-40'}`}
        >
            <div className="mb-2">{num}</div>
            <div className="flex flex-col gap-1 text-xs">
                {assignments.map((a) => (
                    <div
                        key={a.id}
                        className="bg-blue-500 text-white rounded px-1 py-0.5 text-xs truncate mr-2"
                        title={a.title}
                    >
                        {a.title}
                    </div>
                ))}
            </div>
        </div>
    )
}
