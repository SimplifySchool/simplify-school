export interface DayBoxProps{
    num: number
}

export function DayBox({num}: DayBoxProps){
    return(
        <div className="border-2">
            {num}
        </div>
    )
}