import { DayBox } from "../../components/DayBox";
import { DayNames } from "../../components/DaysOfTheWeek/DayNames";

export function SchedulePage(){

    const dayNumbers= []

    for (let index = 1; index <= 31; index++) {
        dayNumbers.push(<DayBox num={index} />)
    }

    const dayNames = [
        "Sunday",
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
    ] as const;

    return (
        <>
            <div className="border w-1204px">
                <div className="Calendar">
                    <div className="MonthName">
                        <h1 className="text-left">
                            Month
                        </h1>
                    </div>
                    <div className="Days">
                        {dayNames.map((name) => (
                            <DayNames key={name} dayName={name} />
                        ))}
                    </div>
                    <div>
                        {... dayNumbers}
                    </div>
                </div>
            </div>
        </>
    )
}