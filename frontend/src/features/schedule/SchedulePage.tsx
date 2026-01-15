import React from 'react'
import { useState } from 'react'
import { MonthlyCalendar } from './MonthlyCalendar'
import { WeeklyView } from './WeeklyView'
import Button from '../../components/Button'

export function SchedulePage() {
    const [page, setPage] = useState(<WeeklyView />)

    function putMonthlyCalendar() {
        setPage(<MonthlyCalendar />)
    }

    function putWeeklyView() {
        setPage(<WeeklyView />)
    }

    return (
        <div className="flex flex-col gap-10">
            <div className="flex flex-row gap-5">
                <Button
                    variant="outlined"
                    className="text-black!"
                    onClick={putWeeklyView}
                >
                    Weekly View
                </Button>
                <Button
                    variant="outlined"
                    className="text-black!"
                    onClick={putMonthlyCalendar}
                >
                    Monthly View
                </Button>
            </div>
            {page}
        </div>
    )
}
