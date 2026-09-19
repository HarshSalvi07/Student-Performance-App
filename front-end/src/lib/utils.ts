import { toast } from "sonner"

export const autoLogout = (navigate: (path: string) => void) => {
    toast.error("Your session has expired. Please login again.")
    localStorage.removeItem("access_token")
    navigate("/login")
}