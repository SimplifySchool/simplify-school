import React from 'react'
import { DayNames } from './DaysOfTheWeek/DayNames'
import { DayBox } from './DaysOfTheWeek/DayBox'
import { addDays, format, startOfWeek } from 'date-fns'

export function WeeklyView() {
    const dayNames = [
        'Sunday',
        'Monday',
        'Tuesday',
        'Wednesday',
        'Thursday',
        'Friday',
        'Saturday',
    ] as const

    const today = new Date()

    const start = startOfWeek(today)

    function createWeek() {
        return Array.from({ length: 7 }, (_, i) => {
            const date = addDays(start, i)

            return <DayBox key={i} num={date.getDate()} isCurrentMonth={true} />
        })
    }

    return (
        <div className="border w-[1206px]">
            <h1 className="pl-2 pt-2 pb-2 text-6xl font-bold text-center border">
                Week Of {format(start, 'MMMM do')}
            </h1>
            <div className="grid grid-cols-7">
                {dayNames.map((name) => (
                    <DayNames key={name} dayName={name} />
                ))}
            </div>
            <div className="grid grid-cols-7">{createWeek()}</div>
        </div>
    )
}
