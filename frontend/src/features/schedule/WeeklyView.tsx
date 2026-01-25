import { addDays, format, startOfWeek } from 'date-fns'
import { useState } from 'react'
import Button from '../../components/Button'
import { Dialog } from '../../components/DialogBox/Dialog'
import { DialogContent } from '../../components/DialogBox/DialogContent'
import { DialogFooter } from '../../components/DialogBox/DialogFooter'
import { DialogHeader } from '../../components/DialogBox/DialogHeader'
import { DayBox } from './DaysOfTheWeek/DayBox'
import { DayNames } from './DaysOfTheWeek/DayNames'
import { useAssignments } from '../../hooks/useAssignments'

export function WeeklyView() {
    const [clickedDay, setClickedDay] = useState<Date | null>(null)
    const { assignments } = useAssignments()

    const [visible, setVisible] = useState(false)

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

    const clickedISODate = clickedDay ? format(clickedDay, 'yyyy-MM-dd') : null

    const assignmentsForDay = clickedISODate
        ? assignments.filter((a) => a.due_date?.startsWith(clickedISODate))
        : []

    function createWeek() {
        return Array.from({ length: 7 }, (_, i) => {
            const date = addDays(start, i)

            return (
                <DayBox
                    onClick={() => showDayDialog(date)}
                    key={i}
                    num={date.getDate()}
                    date={date}
                />
            )
        })
    }

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
                    Week Of {format(start, 'MMMM do')}
                </h1>
                <div className="grid grid-cols-7">
                    {dayNames.map((name) => (
                        <DayNames key={name} dayName={name} />
                    ))}
                </div>
                <div className="grid grid-cols-7">{createWeek()}</div>
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
                <DialogContent>
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
