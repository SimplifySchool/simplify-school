export function DialogContent({
    children,
    extraClassNames = '',
}: {
    children: React.ReactNode
    extraClassNames?: string
}) {
    return (
        <div className={`px-6 py-4 ${extraClassNames} overflow-y-auto`}>
            {children}
        </div>
    )
}
// Content found in a Dialog box
