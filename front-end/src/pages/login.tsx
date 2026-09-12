import axios from "axios"
import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import logowithtext from "../assets/logowithtext.png"

function Login() {

    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const navigate = useNavigate()

    const LoginButton = async () => {
        try {
            const from_data = new URLSearchParams()

            from_data.append("username", username)
            from_data.append("password", password)

            const res = await axios.post(
                "http://127.0.0.1:8000/login",
                from_data,
                {
                    headers: {
                        "Content-Type": "application/x-www-form-urlencoded",
                    },
                }
            )

            localStorage.setItem("access_token", res.data.access_token)
            console.log("Login Successful")

        } catch (error: any) {
            console.log("STATUS:", error.response?.status)
            console.log("DETAIL:", error.response?.data?.detail)
        }

        navigate("/dashboard")
    }

    return (
        <div className="min-h-screen relative overflow-hidden bg-linear-to-br from-slate-50 via-white to-indigo-50 flex items-center justify-center px-4">

            {/* Background Blur */}
            <div className="absolute -top-20 -left-16 h-72 w-72 rounded-full bg-indigo-200/30 blur-3xl" />
            <div className="absolute -bottom-20 -right-10 h-80 w-80 rounded-full bg-violet-200/30 blur-3xl" />

            {/* Login Card */}
            <div className="relative w-full max-w-md rounded-[28px] border border-white/70 bg-white/80 backdrop-blur-xl shadow-[0_20px_60px_rgba(79,70,229,0.12)] p-8">

                {/* Header */}
                <div className="text-center mb-8">
                    <img src={logowithtext} alt="" className="mx-auto flex justify-center h-45 w-45" />

                    <h1 className="text-3xl font-bold tracking-tight text-slate-900">
                        Welcome Back
                    </h1>

                    <p className="mt-2 text-sm leading-6 text-slate-500">
                        Continue your AI-powered learning journey.
                    </p>

                </div>

                <form className="space-y-5">

                    {/* Username */}
                    <div>

                        <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                            Username
                        </label>

                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            placeholder="Enter your username"
                            className="w-full rounded-xl border border-slate-200 bg-white/70 px-4 py-3 text-sm text-slate-700 placeholder:text-slate-400 shadow-sm transition-all duration-200 focus:border-indigo-500 focus:outline-none focus:ring-4 focus:ring-indigo-100"
                        />

                    </div>

                    {/* Password */}
                    <div>

                        <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                            Password
                        </label>

                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Enter your password"
                            className="w-full rounded-xl border border-slate-200 bg-white/70 px-4 py-3 text-sm text-slate-700 placeholder:text-slate-400 shadow-sm transition-all duration-200 focus:border-indigo-500 focus:outline-none focus:ring-4 focus:ring-indigo-100"
                        />

                    </div>

                    {/* Login Button */}
                    <button
                        type="button"
                        onClick={LoginButton}
                        className="w-full rounded-xl bg-linear-to-r from-indigo-600 to-violet-600 py-3.5 text-sm font-semibold tracking-wide text-white shadow-[0_12px_30px_rgba(79,70,229,0.35)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_18px_40px_rgba(79,70,229,0.45)] active:translate-y-0"
                    >
                        Login
                    </button>

                    {/* Register */}
                    <div className="pt-1 text-center text-sm text-slate-500">

                        Don't have an account?{" "}

                        <Link
                            to="/register"
                            className="font-semibold text-indigo-600 transition hover:text-indigo-700"
                        >
                            Create Account
                        </Link>

                    </div>

                </form>

            </div>
        </div>
    )
}

export default Login