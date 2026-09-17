import { NavLink, Link, useNavigate } from "react-router-dom"
import { useEffect, useState } from "react"
import logo from "../assets/logo.png"
import axios from "axios"

function Navbar() {
    const [isLoggedIn, setIsLoggedIn] = useState(false)
    const navigate = useNavigate()

    useEffect(() => {
        const checkAuth = async () => {
            const token = localStorage.getItem("access_token")

            if (!token) {
                setIsLoggedIn(false)
                return
            }

            try {
                await axios.get("http://127.0.0.1:8000/profile", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                })

                setIsLoggedIn(true)

            } catch {
                localStorage.removeItem("access_token")
                setIsLoggedIn(false)
            }
        }

        checkAuth()
    }, [])

    const logout = () => {
        localStorage.removeItem("access_token")
        setIsLoggedIn(false)
        navigate("/")
    }

    // Active page styling
    const navLinkClass = ({ isActive }: { isActive: boolean }) =>
        `relative px-2 py-1 transition
        ${isActive
            ? "text-indigo-600 after:absolute after:left-0 after:right-0 after:-bottom-1 after:h-0.5 after:rounded-full after:bg-indigo-600"
            : "text-slate-700 hover:text-indigo-600"
        }`

    return (
        <nav className="bg-[#F6F8FC] sticky top-1 z-50">
            <div className="bg-indigo-50 max-w-[100rem] px-8 mx-auto backdrop-blur-lg flex items-center justify-between rounded-full">

                {/* Logo */}
                <Link to={isLoggedIn ? "/dashboard" : "/"}>
                    <div className="flex gap-4 items-center">
                        <img
                            src={logo}
                            alt="logo"
                            className="h-20 w-20 "
                        />

                        <div className="flex flex-col">
                            <div className="flex items-center gap-2 mb-1">
                                {/* <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></div> */}
                            </div>

                            <h1 className="text-2xl font-black leading-none text-slate-900">
                                Student
                                <span className="block bg-linear-to-r from-indigo-500 via-violet-400 to-fuchsia-700 bg-clip-text text-transparent">
                                    Performance Analysis
                                </span>
                                
                            </h1>
                        </div>
                    </div>
                </Link>

                {/* Navigation */}
                <ul className="flex items-center gap-8 font-semibold">

                    {/* Guest Navigation */}
                    {!isLoggedIn && (
                        <>
                            <li>
                                <NavLink to="/" className={navLinkClass}>
                                    Home
                                </NavLink>
                            </li>

                            <li>
                                <NavLink to="/about" className={navLinkClass}>
                                    About
                                </NavLink>
                            </li>
                        </>
                    )}

                    {/* Logged-in Navigation */}
                    {isLoggedIn ? (
                        <>
                            <li>
                                <NavLink
                                    to="/dashboard"
                                    className={navLinkClass}
                                >
                                    Dashboard
                                </NavLink>
                            </li>

                            <li>
                                <NavLink
                                    to="/history"
                                    className={navLinkClass}
                                >
                                    History
                                </NavLink>
                            </li>

                            <li>
                                <NavLink
                                    to="/about"
                                    className={navLinkClass}
                                >
                                    About
                                </NavLink>
                            </li>

                            <li>
                                <NavLink
                                    to="/profile"
                                    className={navLinkClass}
                                >
                                    Profile
                                </NavLink>
                            </li>

                            <li>
                                <button
                                    onClick={logout}
                                    className="rounded-lg bg-linear-to-r from-indigo-600 to-violet-600 px-4 py-2 text-white shadow-md transition hover:-translate-y-0.5"
                                >
                                    Logout
                                </button>
                            </li>
                        </>
                    ) : (
                        /* Login / Register */
                        <>
                            <li>
                                <NavLink
                                    to="/login"
                                    className={navLinkClass}
                                >
                                    Login
                                </NavLink>
                            </li>

                            <li>
                                <NavLink
                                    to="/register"
                                    className="rounded-lg bg-linear-to-r from-indigo-600 to-violet-600 px-4 py-2 text-white shadow-md transition hover:-translate-y-0.5"
                                >
                                    Register
                                </NavLink>
                            </li>
                        </>
                    )}

                </ul>

            </div>
        </nav>
    )
}

export default Navbar
