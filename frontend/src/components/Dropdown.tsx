import React, { useState } from 'react'

interface Option {
    value: string
    label?: string
    className?: string
}

interface DropdownProps {
    options: (Option | string)[]
    value?: string | null
    onChange?: (value: string) => void
    placeholder?: string
    className?: string
}

function normalizeOptions(opts: (Option | string)[]): Option[] {
    return opts.map((o) =>
        typeof o === 'string'
            ? { value: o, label: o }
            : {
                  label: o.label ?? o.value,
                  value: o.value,
                  className: o.className,
              }
    )
}

export default function Dropdown({
    options,
    value = null,
    onChange,
    placeholder = 'Select',
    className = '',
}: DropdownProps) {
    const opts = normalizeOptions(options)
    const isControlled = value !== undefined && value !== null
    const [internalValue, setInternalValue] = useState<string>(
        isControlled ? value ?? '' : ''
    )
    const selectedValue = isControlled ? value ?? '' : internalValue

    const currClassName = opts.find((opt) => {
        const val = typeof opt === 'string' ? opt : opt.value
        return val === selectedValue
    })?.className

    function handleChange(e: React.ChangeEvent<HTMLSelectElement>) {
        const v = e.target.value
        if (!isControlled) setInternalValue(v)
        onChange?.(v)
    }

    return (
        <div className={`relative inline-block text-sm ${className}`}>
            <select
                aria-label={placeholder}
                value={selectedValue ?? ''}
                onChange={handleChange}
                className={`appearance-none w-48 px-3 py-2 rounded-4xl bg-white shadow-sm ring-1 ring-inset ring-gray-200 hover:shadow-md transition focus:outline-none focus:ring-2 focus:ring-primary-400 ${currClassName}`}
            >
                <option value="" disabled hidden>
                    {placeholder}
                </option>
                {opts.map((opt) => (
                    <option
                        key={opt.value}
                        value={opt.value}
                        className={opt.className}
                    >
                        {opt.label}
                    </option>
                ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-2 flex items-center text-gray-600">
                <svg
                    className="w-5 h-5"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                >
                    <path
                        strokeWidth={2}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M6 9l6 6 6-6"
                    />
                </svg>
            </div>
        </div>
    )
}
