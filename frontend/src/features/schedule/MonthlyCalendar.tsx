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
import Button from '../../components/Button'
import { Dialog } from '../../components/DialogBox/Dialog'
import { DialogContent } from '../../components/DialogBox/DialogContent'
import { DialogFooter } from '../../components/DialogBox/DialogFooter'
import { DialogHeader } from '../../components/DialogBox/DialogHeader'
import { DayBox } from './DaysOfTheWeek/DayBox'
import { DayNames } from './DaysOfTheWeek/DayNames'
import { useAssignments } from '../../hooks/useAssignments'

type MonthOffset = -1 | 0 | 1

interface CalendarCell {
    day: number
    monthOffset: MonthOffset
    date: Date
}

export function MonthlyCalendar() {
    const { assignments } = useAssignments()
    const [clickedDay, setClickedDay] = useState<Date | null>(null)

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

    const clickedISODate = clickedDay ? format(clickedDay, 'yyyy-MM-dd') : null

    const assignmentsForDay = clickedISODate
        ? assignments.filter((a) => a.due_date?.startsWith(clickedISODate))
        : []

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

    function showDayDialog(date: Date) {
        setClickedDay(date)
        setVisible(true)
    }

    return (
        <>
            <div className="border w-auto">
                <h1 className="pl-2 pt-2 pb-2 text-6xl font-bold text-center border">
                    {monthName}
                </h1>

                <div className="w-auto">
                    <div className="grid grid-cols-7">
                        {dayNames.map((name) => (
                            <DayNames key={name} dayName={name} />
                        ))}
                    </div>
                    <div className="grid grid-cols-7">
                        {cells.map((cell, idx) => (
                            <DayBox
                                onClick={() => showDayDialog(cell.date)}
                                key={`${cell.monthOffset}-${cell.day}-${idx}`}
                                num={cell.day}
                                isCurrentMonth={cell.monthOffset === 0}
                                date={cell.date}
                            />
                        ))}
                    </div>
                </div>
            </div>

            <Dialog open={visible} onClose={hideDayDialog}>
                <DialogHeader
                    extraClassNames="border-b-3"
                    title={
                        <span className="text-4xl">
                            {clickedDay
                                ? format(clickedDay, 'MMMM do yyyy')
                                : ''}
                        </span>
                    }
                ></DialogHeader>
                <DialogContent extraClassNames="h-88">
                    <div className="flex flex-col gap-4 p-2">
                        {assignmentsForDay.length === 0 ? (
                            <p className="italic text-gray-500">
                                No assignments for this day
                            </p>
                        ) : (
                            assignmentsForDay.map((a) => (
                                <div
                                    key={a.id}
                                    className="border rounded-md p-3 flex flex-col gap-1"
                                >
                                    <h3 className="font-bold text-lg">
                                        {a.title}
                                    </h3>
                                    <p className="text-sm text-gray-700">
                                        {a.description}
                                    </p>
                                    <span className="text-xs italic">
                                        Status: {a.completion_status}
                                    </span>
                                </div>
                            ))
                        )}
                    </div>
                </DialogContent>

                <DialogFooter>
                    <Button
                        className="absolute bottom-5 right-5 font-bold! text-white!"
                        onClick={hideDayDialog}
                    >
                        Close
                    </Button>
                </DialogFooter>
            </Dialog>
        </>
    )
}
