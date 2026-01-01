interface TextFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
    variant?: 'filled' | 'outlined'
    color?: 'primary' | 'secondary'
    textSize?: 'sm' | 'md' | 'lg'
    height?: 'sm' | 'md' | 'lg'
    width?: 'sm' | 'md' | 'lg'
    hAlign?: 'left' | 'center' | 'right'
}

export function TextField({
    variant = 'outlined',
    height = 'md',
    width = 'md',
    hAlign = 'left',
    className = '',
    ...props
}: TextFieldProps) {
    const baseClass = 'p-2 focus:outline-none'

    const horAlign = {
        left: 'text-left',
        center: 'text-center',
        right: 'text-right',
    }

    const textFieldHeight = {
        sm: 'h-5',
        md: 'h-10',
        lg: 'h-15',
    }

    const textFieldWidth = {
        sm: 'w-25',
        md: 'w-50',
        lg: 'w-75',
    }

    const variantClassName = {
        filled: 'border-b-[1.75px] focus:border-b-[2.5px] p-2 border-[#49454F] focus:border-[#6750A4] rounded-tr-xs rounded-tl-xs bg-[#E6E0E9]',
        outlined:
            'border-1 focus:border-2 border-[#79747E] focus:border-[#6750A4] rounded-lg bg-transparent text-md ',
    }

    const finalClassName = `${baseClass} ${variantClassName[variant]} ${textFieldHeight[height]} ${textFieldWidth[width]} ${horAlign[hAlign]} ${className}`

    return (
        <label>
            <input type="text" className={finalClassName} {...props} />
        </label>
    )
}
