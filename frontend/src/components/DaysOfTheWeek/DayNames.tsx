export interface DayNamesProps{
    dayName: string
}

export function DayNames({dayName}: DayNamesProps){
    return(
        <div className="border-2">
            {dayName}
        </div>
    )
}