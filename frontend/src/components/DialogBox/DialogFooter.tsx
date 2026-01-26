interface DialogFooterProps {
    bottomSeperator?: boolean
    extraClassName?: string
    children: React.ReactNode
}

export function DialogFooter({
    bottomSeperator = false,
    extraClassName = '',
    children,
}: DialogFooterProps) {
    const sepertor = bottomSeperator ? 'border-t' : ''

    return (
        <div
            className={`flex px-6 py-4 ${sepertor} justify-end items-emd gap-2 ${extraClassName}`}
        >
            {children}
        </div>
    )
}
// Dialog Footer
