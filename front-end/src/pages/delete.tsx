import { toast } from "sonner"
import axios from "axios"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "../components/ui/alert-dialog"
import { Button } from "../components/ui/button"
import { useNavigate } from "react-router-dom"
import { autoLogout } from "../lib/utils"

type Props = {
    id: number
    onDelete: () => void
}

function DeleteHistory({ id, onDelete }: Props) {
    const navigate = useNavigate()
    const deleteRecord = async () => {

        try {
            const token = localStorage.getItem("access_token")

            await axios.delete(
                `http://127.0.0.1:8000/delete_history/${id}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            )
            onDelete()
            toast.success("Analysis deleted successfully")

        } catch (error: any) {
            if (error.message?.status === 401) autoLogout(navigate)
            else if (error.response?.status === 404) {
                toast.error("User not found")
            } else {
                toast.error("Unable to login. Please try again.")
            }
        }
    }

    return (
        <AlertDialog>
            <AlertDialogTrigger render={<Button variant="destructive">Delete</Button>} />
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Delete Generated Notes</AlertDialogTitle>
                    <AlertDialogDescription>
                        This action cannot be undone. This will permanently delete your
                        Generated feedback
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel variant="secondary" size="default" >Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={deleteRecord}>Delete</AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}

export default DeleteHistory