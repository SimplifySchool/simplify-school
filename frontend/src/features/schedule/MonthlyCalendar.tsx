import {
    addDays,
    addMonths,
    format,
    getDay,
    getDaysInMonth,
    startOfMonth,
    subMonths,
} from 'date-fns'
import { useState } from 'react'
import { Dialog } from '../../components/Dialog'
import { DayBox } from './DaysOfTheWeek/DayBox'
import { DayNames } from './DaysOfTheWeek/DayNames'

type MonthOffset = -1 | 0 | 1

interface CalendarCell {
    day: number
    monthOffset: MonthOffset
    date: Date
}

export function MonthlyCalendar() {
    const [visible, setVisible] = useState(false)

    const today: Date = new Date()
    const firstDay = startOfMonth(today)

    const monthName = format(firstDay, 'LLLL yyyy')

    const daysInMonth = getDaysInMonth(firstDay)
    const startWeekIndex = getDay(firstDay) - 1

    const prevMonth = subMonths(firstDay, 1)
    const nextMonth = addMonths(firstDay, 1)

    const daysInPrevMonth = getDaysInMonth(prevMonth)

    const totalCells = 42

    const trail = totalCells - (startWeekIndex + daysInMonth)

    const dayNames = [
        'Sunday',
        'Monday',
        'Tuesday',
        'Wednesday',
        'Thursday',
        'Friday',
        'Saturday',
    ] as const

    const cells: CalendarCell[] = []

    //previous month
    for (let i = 0; i <= startWeekIndex; i++) {
        const day = daysInPrevMonth - startWeekIndex + i
        const cellDate = addDays(prevMonth, day - 1)
        cells.push({ day, monthOffset: -1, date: cellDate })
    }

    //current month
    for (let day = 1; day <= daysInMonth; day++) {
        const cellDate = addDays(firstDay, day - 1)
        cells.push({ day, monthOffset: 0, date: cellDate })
    }

    //next month
    for (let day = 1; day <= trail; day++) {
        const cellDate = addDays(nextMonth, day - 1)
        cells.push({ day, monthOffset: 1, date: cellDate })
    }

    if (cells.length > totalCells) cells.length = totalCells

    function hideDayDialog() {
        setVisible(false)
    }

    function showDayDialog() {
        setVisible(true)
    }

    return (
        <>
            <div className="border w-auto">
                <div className="Calendar">
                    <div className="MonthName">
                        <h1 className="pl-2 pt-2 pb-2 text-6xl font-bold text-center border">
                            {monthName}
                        </h1>
                    </div>

                    <div className="w-auto">
                        <div className="grid grid-cols-7">
                            {dayNames.map((name) => (
                                <DayNames key={name} dayName={name} />
                            ))}
                        </div>
                        <div className="grid grid-cols-7">
                            {cells.map((cell, idx) => (
                                <DayBox
                                    key={`${cell.monthOffset}-${cell.day}-${idx}`}
                                    num={cell.day}
                                    isCurrentMonth={cell.monthOffset === 0}
                                    date={cell.date}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            <Dialog open={visible} onClose={hideDayDialog}>
                <DialogHeader title={<span>{format(today, 'MMMM do')}</span>}>
                    <button onClick={hideDayDialog}>Close</button>
                </DialogHeader>
            </Dialog>
        </>
    )
}
