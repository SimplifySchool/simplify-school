export interface DayNamesProps{
    dayName: string
}

export function DayNames({dayName}: DayNamesProps){
    return(
        <div className="text-2xl font-semibold border-2 p-2">
            {dayName}
        </div>
    )
}