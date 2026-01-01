interface DialogProps {
    open: boolean
    onClose: () => void

    closeOnBackdropClick?: boolean
    closeOnEsc?: boolean

    variant?: 'basic' | 'half'
    width?: 'sm' | 'md' | 'lg'
    height?: 'sm' | 'md' | 'lg'
    children: React.ReactNode
}

export function Dialog({
    open,
    onClose,
    closeOnBackdropClick = true,
    closeOnEsc = true,
    variant = 'half',
    width = 'md',
    height = 'md',
    children,
}: DialogProps) {
    if (!open) {
        return null
    }

    const widthsHalf = {
        sm: 'max-w-sm',
        md: 'max-w-md',
        lg: 'max-w-lg',
    }

    const heightsHalf = {
        sm: 'h-50',
        md: 'h-80',
        lg: 'h-100',
    }

    const finalWidth = variant === 'half' ? 'w-full' : ''
    const finalHeight = variant === 'half' ? heightsHalf[height] : ''
    const finalSize = `${finalHeight} ${finalWidth}`

    return (
        <div
            className="fixed inset-0 z-50 flex items-end justify-center"
            onClick={closeOnBackdropClick ? onClose : undefined}
        >
            <div className="absolute inset-0 bg-black/40" />

            <div
                className={`relative bg-white rounded-lg shadow-lg  ${finalSize}`}
                onClick={(e) => e.stopPropagation()}
            >
                {children}
            </div>
        </div>
    )
}
