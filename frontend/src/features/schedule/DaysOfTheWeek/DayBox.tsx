import React, { useState } from 'react'

export interface DayBoxProps {
    num: number
    isCurrentMonth?: boolean
    date?: Date
}

export function DayBox({ num, isCurrentMonth }: DayBoxProps) {
    const [isHovered, setIsHovered] = useState(false)

    const baseDayStyle = {
        backgroundColor: 'white',
        transition: 'background-color 0.3s ease',
        cursor: 'pointer',
    }

    const hoverDayStyle = {
        backgroundColor: 'lightgrey',
    }

    return (
        <div
            style={
                isHovered ? { ...baseDayStyle, ...hoverDayStyle } : baseDayStyle
            }
            onClick={() => alert('Hi')}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            className={`text-left text-3xl pl-2 pt-1 border-2 w-[172px] h-[172px] ${
                isCurrentMonth ? '' : 'opacity-40'
            }`}
        >
            {num}
        </div>
    )
}
