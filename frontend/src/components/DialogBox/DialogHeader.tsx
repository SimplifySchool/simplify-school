interface DialogHeaderProps {
    title?: string | React.ReactNode
    titleProperties?: string
    extraClassNames?: string
    underlinedSeperator?: boolean
    children?: React.ReactNode
}

export function DialogHeader({
    title = '',
    titleProperties = 'text-lg font-semibold',
    underlinedSeperator = false,
    extraClassNames = '',
    children,
}: DialogHeaderProps) {
    const seperator = underlinedSeperator ? 'border-b' : ''
    return (
        <div className={`px-6 py-4 ${seperator} ${extraClassNames}`}>
            {title && <h2 className={`${titleProperties}`}>{title}</h2>}
            {children}
        </div>
    )
}
// Dialog Header
