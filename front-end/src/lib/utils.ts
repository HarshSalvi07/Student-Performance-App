export const autoLogout = (navigate: (path: string) => void) => {
    localStorage.removeItem("access_token")
    navigate("/login")
}