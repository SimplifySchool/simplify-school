interface DialogProps {
    open: boolean
    onClose: () => void

    closeOnBackdropClick?: boolean

    backgroundColor?: string

    extraBackdropClassNames?: string
    extraDialogBoxClassNames?: string

    variant?: 'basic' | 'half' | 'full'
    width?: 'sm' | 'md' | 'lg'
    height?: 'sm' | 'md' | 'lg'
    children: React.ReactNode
}

export function Dialog({
    open,
    onClose,
    closeOnBackdropClick = true,
    backgroundColor = 'bg-white',
    extraBackdropClassNames = '',
    extraDialogBoxClassNames = '',
    variant = 'basic',
    width = 'sm',
    height = 'lg',
    children,
}: DialogProps) {
    if (!open) {
        return null
    }

    const heights = {
        basic: {
            sm: 'h-75',
            md: 'h-100',
            lg: 'h-125',
        },
        half: {
            sm: 'h-50',
            md: 'h-80',
            lg: 'h-100',
        },
    }

    const widths = {
        sm: 'w-150',
        md: 'w-200',
        lg: 'w-250',
    }

    const positions = {
        basic: 'items-center',
        half: 'items-end',
        full: 'items-start', // It does not matter where this one goes, it takes up the full screen either ways.
    }

    const finalWidth = variant === 'basic' ? widths[width] : 'w-full'
    const finalHeight = variant === 'full' ? 'h-full' : heights[variant][height]
    const finalSize = `${finalHeight} ${finalWidth}`

    const finalItemsPosition = `${positions[variant]}`

    return (
        <div
            className={`fixed inset-0 z-50 flex ${finalItemsPosition} justify-center ${extraBackdropClassNames}`}
            onClick={closeOnBackdropClick ? onClose : undefined}
        >
            <div className="absolute inset-0 bg-black/40" />

            <div
                className={`relative ${backgroundColor} rounded-lg shadow-lg  ${finalSize} ${extraDialogBoxClassNames}`}
                onClick={(e) => e.stopPropagation()}
            >
                {children}
            </div>
        </div>
    )
}

// Dialog
