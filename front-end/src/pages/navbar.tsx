import { Link, useNavigate } from "react-router-dom"
import { useEffect, useState } from "react"
import logo from "../assets/logo.png"

function Navbar() {
    const [isLoggedIn, setIsLoggedIn] = useState(false)
    const navigate = useNavigate()

    useEffect(() => {
        const token = localStorage.getItem("access_token")
        setIsLoggedIn(!!token)
    }, [])

    const logout = () => {
        localStorage.removeItem("access_token")
        setIsLoggedIn(false)
        navigate("/")
    }

    return (
        <nav className="bg-[#F6F8FC] sticky top-1 z-50">
            <div className="bg-indigo-50 max-w-[100rem] px-8 mx-auto backdrop-blur-lg flex items-center justify-between rounded-full">

                {/* Logo */}
                <Link to={isLoggedIn ? "/dashboard" : "/"}>
                    <div className="flex gap-4 items-center">
                        <img src={logo} alt="logo" className="h-20 w-20" />

                        <div>
                            <h1 className="text-2xl font-bold text-slate-800">
                                Student Performance Analysis
                            </h1>

                            <ul className="flex gap-8 justify-center text-gray-600 text-sm mt-1">
                                <li>• Scan</li>
                                <li>• Learn</li>
                                <li>• Improve</li>
                            </ul>
                        </div>
                    </div>
                </Link>

                {/* Navigation */}
                <ul className="flex items-center gap-8 text-slate-700 font-semibold ">

                    {!isLoggedIn && (
                        <li>
                            <Link to="/" className="hover:text-indigo-600 transition hover:bg-indigo-100 p-1 px-2 rounded-xl">
                                Home
                            </Link>
                        </li>
                    )}

                    <li>
                        <Link to="/about" className="hover:text-indigo-600 transition hover:bg-indigo-100 p-1 px-2 rounded-xl">
                            About
                        </Link>
                    </li>

                    {isLoggedIn ? (
                        <>
                            <li>
                                <Link to="/dashboard" className="hover:text-indigo-600 transition hover:bg-indigo-100 p-1 px-2 rounded-xl">
                                    Dashboard
                                </Link>
                            </li>

                            <li>
                                <Link to="/history" className="hover:text-indigo-600 transition hover:bg-indigo-100 p-1 px-2 rounded-xl">
                                    History
                                </Link>
                            </li>

                            <li>
                                <Link to="/profile" className="hover:text-indigo-600 transition hover:bg-indigo-100 p-1 px-2 rounded-xl">
                                    Profile
                                </Link>
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
                        <>
                            <li>
                                <Link to="/login" className="hover:text-indigo-600 transition hover:bg-indigo-100 p-1 px-2 rounded-xl">
                                    Login
                                </Link>
                            </li>

                            <li>
                                <Link
                                    to="/register"
                                    className="rounded-lg bg-linear-to-r from-indigo-600 to-violet-600 px-4 py-2 text-white shadow-md transition hover:-translate-y-0.5"
                                >
                                    Register
                                </Link>
                            </li>
                        </>
                    )}
                </ul>

            </div>
        </nav>
    )
}

export default Navbar