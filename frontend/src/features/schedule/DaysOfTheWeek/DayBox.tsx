import { isToday } from 'date-fns'

export interface DayBoxProps {
    num: number
    isCurrentMonth?: boolean
    date: Date
}

export function DayBox({ num, isCurrentMonth, date }: DayBoxProps) {
    const isTodayBox = isToday(date)

    return (
        <div
            onClick={() => alert('Hi')}
            className={`text-left text-3xl pl-2 pt-1 border-2 w-auto h-43 transition-colors cursor-pointer ${
                isTodayBox
                    ? 'bg-blue-200 hover:bg-[#D3D3D3]'
                    : 'bg-white hover:bg-[#D3D3D3]'
            }  ${isCurrentMonth ? '' : 'opacity-40'}`}
        >
            {num}
        </div>
    )
}
