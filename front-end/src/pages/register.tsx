import axios from "axios"
import { useState } from "react"
import { Link } from "react-router-dom"
import { useNavigate } from "react-router-dom"
import logowithtext from "../assets/logowithtext.png"

function Register() {

    const [image, setImage] = useState<File | null>(null)
    const [username, setUsername] = useState('')
    const [age, setAge] = useState(0)
    const [description, setDescription] = useState('')
    const [studentClass, setStudentClass] = useState('')
    const [email, setEmail] = useState('')
    const [create_password, setCreatePassword] = useState('')
    const [confirm_password, setConfirmPassword] = useState('')
    const navigate = useNavigate()

    const registerButton = async () => {
        try {
            const form_data = new FormData()

            const user = {
                username,
                age,
                description,
                studentClass,
                email,
                create_password,
                confirm_password,
            }

            form_data.append("user", JSON.stringify(user))

            if (image) {
                form_data.append("image", image)
            }

            const res = await axios.post(
                "http://127.0.0.1:8000/register",
                form_data
            )

            console.log(res.data)
        }
        catch (error: any) {
            console.log("STATUS:", error.response?.status)
            console.log("DETAIL:", error.response?.data?.detail)
        }
        finally{
            navigate("/login")
        }
    }

    return (
        <div className="min-h-screen relative overflow-hidden bg-linear-to-br from-slate-50 via-white to-indigo-50 flex items-center justify-center px-4 py-10">

            {/* Background Blur */}
            <div className="absolute -top-20 -left-16 h-72 w-72 rounded-full bg-indigo-200/30 blur-3xl" />
            <div className="absolute -bottom-20 -right-10 h-80 w-80 rounded-full bg-violet-200/30 blur-3xl" />

            <div className="relative w-full max-w-2xl rounded-[28px] border border-white/70 bg-white/80 backdrop-blur-xl shadow-[0_20px_60px_rgba(79,70,229,0.12)] p-6 sm:p-8">

                {/* Header */}
                <div className="text-center mb-8">

                    <div className="mx-auto mb-4 flex h-54 w-md items-center justify-center rounded-2xl bg-linear-to-br bg-indigo-50 shadow-indigo-900 shadow-xl/40 ">
                        <img src={logowithtext} alt=""  />
                    </div>
                </div>

                <form className="space-y-5">

                    {/* Profile Image */}
                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">
                            Profile Image
                        </label>

                        <label
                            htmlFor="Image"
                            className="group flex h-36 w-full cursor-pointer flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-linear-to-br from-slate-50 to-indigo-50 transition-all duration-300 hover:-translate-y-1 hover:border-indigo-400 hover:shadow-lg"
                        >

                            {image ? (
                                <div className="text-center">
                                    <div className="mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100">
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            className="h-5 w-5 text-emerald-600"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                            strokeWidth={2}
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                d="M5 13l4 4L19 7"
                                            />
                                        </svg>
                                    </div>

                                    <p className="font-medium text-slate-700">
                                        {image.name}
                                    </p>

                                    <p className="mt-1 text-xs text-indigo-600">
                                        Click to change image
                                    </p>
                                </div>
                            ) : (
                                <>
                                    <div className="mb-3 rounded-full bg-indigo-100 p-3 transition group-hover:scale-105">
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            className="h-7 w-7 text-indigo-600"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                            strokeWidth={1.6}
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                d="M3 16.5V6.75A2.25 2.25 0 015.25 4.5h13.5A2.25 2.25 0 0121 6.75v9.75m-18 0l4.5-4.5a2.25 2.25 0 013.182 0L15 16.5m0 0l2.25-2.25a2.25 2.25 0 013.182 0L21 16.5"
                                            />
                                        </svg>
                                    </div>

                                    <p className="font-medium text-slate-700">
                                        Upload your profile image
                                    </p>

                                    <p className="mt-1 text-xs text-slate-400">
                                        PNG, JPG or JPEG
                                    </p>
                                </>
                            )}

                            <input
                                id="Image"
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={(e) => {
                                    const file = e.target.files?.[0]
                                    if (file) setImage(file)
                                }}
                            />
                        </label>
                    </div>

                    {/* Username */}
                    <div>
                        <label className="mb-1.5 block text-sm font-semibold text-slate-700">
                            Username
                        </label>

                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            placeholder="Enter your username"
                            className="w-full rounded-xl border border-slate-200 bg-white/70 px-4 py-3 text-sm shadow-sm transition-all duration-200 placeholder:text-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-4 focus:ring-indigo-100"
                        />
                    </div>

                    {/* Age & Class */}
                    <div className="grid gap-4 sm:grid-cols-2">

                        <div>
                            <label className="mb-1.5 block text-sm font-semibold text-slate-700">
                                Age
                            </label>

                            <input
                                type="number"
                                value={age}
                                onChange={(e) => setAge(Number(e.target.value))}
                                className="w-full rounded-xl border border-slate-200 bg-white/70 px-4 py-3 text-sm shadow-sm transition-all duration-200 focus:border-indigo-500 focus:outline-none focus:ring-4 focus:ring-indigo-100"
                            />
                        </div>

                        <div>
                            <label className="mb-1.5 block text-sm font-semibold text-slate-700">
                                Standard / Class
                            </label>

                            <input
                                type="text"
                                value={studentClass}
                                onChange={(e) => setStudentClass(e.target.value)}
                                placeholder="e.g. 10th"
                                className="w-full rounded-xl border border-slate-200 bg-white/70 px-4 py-3 text-sm shadow-sm transition-all duration-200 placeholder:text-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-4 focus:ring-indigo-100"
                            />
                        </div>

                    </div>

                    {/* Description */}
                    <div>
                        <label className="mb-1.5 block text-sm font-semibold text-slate-700">
                            About You
                        </label>

                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            rows={3}
                            placeholder="Tell us about yourself..."
                            className="w-full resize-none rounded-xl border border-slate-200 bg-white/70 px-4 py-3 text-sm shadow-sm transition-all duration-200 placeholder:text-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-4 focus:ring-indigo-100"
                        />
                    </div>

                    {/* Email */}
                    <div>
                        <label className="mb-1.5 block text-sm font-semibold text-slate-700">
                            Email Address
                        </label>

                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Enter your email"
                            className="w-full rounded-xl border border-slate-200 bg-white/70 px-4 py-3 text-sm shadow-sm transition-all duration-200 placeholder:text-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-4 focus:ring-indigo-100"
                        />
                    </div>

                    {/* Password */}
                    <div className="grid gap-4 sm:grid-cols-2">

                        <div>
                            <label className="mb-1.5 block text-sm font-semibold text-slate-700">
                                Create Password
                            </label>

                            <input
                                type="password"
                                value={create_password}
                                onChange={(e) => setCreatePassword(e.target.value)}
                                placeholder="Create password"
                                className="w-full rounded-xl border border-slate-200 bg-white/70 px-4 py-3 text-sm shadow-sm transition-all duration-200 placeholder:text-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-4 focus:ring-indigo-100"
                            />
                        </div>

                        <div>
                            <label className="mb-1.5 block text-sm font-semibold text-slate-700">
                                Confirm Password
                            </label>

                            <input
                                type="password"
                                value={confirm_password}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                placeholder="Confirm password"
                                className="w-full rounded-xl border border-slate-200 bg-white/70 px-4 py-3 text-sm shadow-sm transition-all duration-200 placeholder:text-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-4 focus:ring-indigo-100"
                            />
                        </div>

                    </div>

                    {/* Button */}
                    <button
                        type="button"
                        onClick={registerButton}
                        className="w-full rounded-xl bg-linear-to-r from-indigo-600 to-violet-600 py-3.5 text-sm font-semibold tracking-wide text-white shadow-[0_12px_30px_rgba(79,70,229,0.35)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_18px_40px_rgba(79,70,229,0.45)] active:translate-y-0"
                    >
                        Create Account
                    </button>

                    <div className="pt-1 text-center text-sm text-slate-500">
                        Already have an account?{" "}
                        <Link
                            to="/login"
                            className="font-semibold text-indigo-600 transition hover:text-indigo-700"
                        >
                            Login
                        </Link>
                    </div>

                </form>
            </div>
        </div>
    )
}

export default Register