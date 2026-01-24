import { useState } from 'react'
import { MonthlyCalendar } from './MonthlyCalendar'
import { WeeklyView } from './WeeklyView'
import Button from '../../components/Button'

type onePage = 'weekly' | 'monthly'

export function SchedulePage() {
    const DEFAULT_PAGE = 'weekly'

    const [page, setPage] = useState(DEFAULT_PAGE as onePage)

    function putMonthlyCalendar() {
        setPage('monthly' as onePage)
    }

    function putWeeklyView() {
        setPage('weekly' as onePage)
    }

    function renderPage() {
        switch (page) {
            case 'weekly':
                return <WeeklyView />
            case 'monthly':
                return <MonthlyCalendar />
        }
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
            {renderPage()}
        </div>
    )
}
