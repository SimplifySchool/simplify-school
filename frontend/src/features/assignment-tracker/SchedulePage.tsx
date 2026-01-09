import { DayBox } from "../../components/DayBox";
import { DayNames } from "../../components/DaysOfTheWeek/DayNames";

export function SchedulePage(){

    const today = new Date();
    const formatting = { month: 'long' };
    const longMonth = new Intl.DateTimeFormat('en-US', formatting).format(today);

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
            <div className="border border-r-1 w-[1206px]">
                <div className="Calendar">
                    <div className="MonthName">
                        <h1 className="pl-2 pt-2 text-7xl font-bold text-left border">
                            {longMonth}
                        </h1>
                    </div>

                    <div className="w-[1204px]">
                        <div className="grid grid-cols-7">
                            {dayNames.map((name) => (
                            <DayNames key={name} dayName={name} />
                            ))}
                        </div>
                        <button className="grid grid-cols-7">
                            {dayNumbers}
                        </button>
                    </div>
                </div>
            </div>
        </>
    )
}