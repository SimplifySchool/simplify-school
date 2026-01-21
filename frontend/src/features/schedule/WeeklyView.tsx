import { addDays, format, startOfWeek } from 'date-fns'
import { useState } from 'react'
import Button from '../../components/Button'
import { Dialog } from '../../components/DialogBox/Dialog'
import { DialogContent } from '../../components/DialogBox/DialogContent'
import { DialogFooter } from '../../components/DialogBox/DialogFooter'
import { DialogHeader } from '../../components/DialogBox/DialogHeader'
import { DayBox } from './DaysOfTheWeek/DayBox'
import { DayNames } from './DaysOfTheWeek/DayNames'

export function WeeklyView() {
    const [clickedDay, setClickedDay] = useState<Date | null>(null)

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

    function createWeek() {
        return Array.from({ length: 7 }, (_, i) => {
            const date = addDays(start, i)

            return (
                <DayBox
                    onClick={() => showDayDialog(date)}
                    key={i}
                    num={date.getDate()}
                    isCurrentMonth={true}
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
                <DialogContent>Assignment</DialogContent>
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
