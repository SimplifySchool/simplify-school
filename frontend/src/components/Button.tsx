import React from 'react'

export interface ButtonProps
    extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'contained' | 'outlined' | 'text' | 'tonal'
    color?: 'primary' | 'secondary'
    size?: 'sm' | 'md' | 'lg'
    children: React.ReactNode
}

export function Button({
    variant = 'contained',
    color = 'primary',
    size = 'md',
    children,
    className = '',
    ...props
}: ButtonProps) {
    const baseStyles =
        'inline-flex items-center justify-center font-sans font-medium tracking-wide transition-all duration-200 active:scale-95 focus:outline-none rounded-full'

    const variants = {
        contained: {
            primary:
                'bg-indigo-700 text-white hover:shadow-sm hover:bg-indigo-800',
            secondary:
                'bg-teal-700 text-white hover:shadow-sm hover:bg-teal-800',
        },
        tonal: {
            primary: 'bg-indigo-100 text-indigo-900 hover:bg-indigo-200',
            secondary: 'bg-teal-100 text-teal-900 hover:bg-teal-200',
        },
        outlined: {
            primary:
                'border border-slate-300 text-indigo-700 hover:bg-indigo-50',
            secondary: 'border border-slate-300 text-teal-700 hover:bg-teal-50',
        },
        text: {
            primary: 'text-indigo-700 hover:bg-indigo-50',
            secondary: 'text-teal-700 hover:bg-teal-50',
        },
    }

    const sizes = {
        sm: 'h-8 px-4 text-xs',
        md: 'h-10 px-6 text-sm',
        lg: 'h-12 px-8 text-base',
    }

    const variantStyles = variants[variant][color]
    const sizeStyles = sizes[size]

    const combinedClasses = `${baseStyles} ${variantStyles} ${sizeStyles} ${className}`

    return (
        <button className={combinedClasses} {...props}>
            {children}
        </button>
    )
}

export default Button
