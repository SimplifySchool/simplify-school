import { useState } from 'react'
import Button from '../../components/Button'
import { Dialog } from '../../components/DialogBox/Dialog'
import { DialogContent } from '../../components/DialogBox/DialogContent'
import { DialogFooter } from '../../components/DialogBox/DialogFooter'
import { DialogHeader } from '../../components/DialogBox/DialogHeader'

interface DeleteDialogProps {
    open: boolean
    onClickDontShowAgain: () => void
    onClose: () => void
    strings?: string[]
}

export function DeleteAssignmentDialogBox({
    open,
    onClose,
    onClickDontShowAgain,
    strings = [],
}: DeleteDialogProps) {
    const [boxValue, setBoxValue] = useState(false)

    function checkTheBox() {
        if (boxValue == true) {
            setBoxValue(false)
        } else {
            setBoxValue(true)
        }
    }

    return (
        <>
            <Dialog
                open={open}
                onClose={onClose}
                extraDialogBoxClassNames="w-75! h-75!"
            >
                <DialogHeader
                    title={<span>Warning!</span>}
                    titleProperties="flex text-lg font-semibold justify-center"
                    underlinedSeperator={false}
                >
                    <Button
                        variant="outlined"
                        size="sm"
                        className="absolute w-8 m-1.25 text-lg! top-0 border-0 right-0 text-black! material-symbols-outlined px-1! hover:bg-transparent"
                        onClick={onClose}
                    >
                        close
                    </Button>
                </DialogHeader>
                <DialogContent>hi</DialogContent>
                <DialogFooter extraClassName="px-0!">
                    <div className="absolute bottom-5 flex flex-col gap-5 w-full">
                        <div className="flex flex-row justify-center gap-2">
                            <Button
                                variant="text"
                                className="hover:bg-transparent! gap-1.25"
                            >
                                <input
                                    type="checkbox"
                                    checked={boxValue}
                                    onClick={checkTheBox}
                                    className="w-5 h-5"
                                ></input>
                                <button
                                    className="h-5! w-27! whitespace-nowrap text-black!"
                                    onClick={checkTheBox}
                                >
                                    Don't show again
                                </button>
                            </Button>
                        </div>
                        <div className="flex flex-row gap-2 mx-4">
                            <Button
                                variant="outlined"
                                className="grow min-w-0 px-8! text-black!"
                            >
                                Exit
                            </Button>
                            <Button
                                variant="contained"
                                className="grow min-w-0 bg-red-400 hover:bg-red-500"
                            >
                                Delete
                            </Button>
                        </div>
                    </div>
                </DialogFooter>
            </Dialog>
        </>
    )
}

export default DeleteAssignmentDialogBox
