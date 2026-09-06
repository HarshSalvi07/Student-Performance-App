// import axios from "axios"
// import { useState } from "react"
// import { Link } from "react-router-dom"

// function Login() {
//     const [username, setUsername] = useState('')
//     const [password, setPassword] = useState('')

//     const LoginButton = async () => {
//         const from_data = new URLSearchParams()

//         from_data.append("username", username)
//         from_data.append("password", password)
//         const res = await axios.post("http://127.0.0.1:8000/login",
//             from_data,
//             {
//                 headers: {
//                     "Content-Type": "application/x-www-form-urlencoded",
//                 },
//             }
//         )
//         console.log("Login Successfull")
//     }

//     return (
//         <div>
//             <form >
//                 {/* USERNAME */}
//                 <label htmlFor="Username">Username</label>
//                 <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} />
//                 {/* PASSWORD */}
//                 <label htmlFor="Password">Password</label>
//                 <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
//                 <button type="button" onClick={LoginButton}>Submit</button>
//                 <h3><Link to={"/register"}>Register</Link></h3>
//             </form>
//         </div>
//     )
// }

// export default Login


import axios from "axios"
import { useState } from "react"
import { Link } from "react-router-dom"

function Login() {

    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")

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

            console.log("Login Successful")
            console.log(res.data)

        } catch (error: any) {
            console.log("STATUS:", error.response?.status)
            console.log("DETAIL:", error.response?.data?.detail)
        }
    }

    return (
        <div className="min-h-screen w-full bg-gray-50 flex items-center justify-center px-4">

            {/* MAIN CONTAINER */}
            <div className="w-full max-w-md bg-white rounded-xl border border-gray-400 shadow-2xl p-6 sm:p-8">

                {/* HEADER */}
                <div className="text-center mb-8">

                    <h1 className="text-2xl font-semibold text-gray-800">
                        Welcome Back
                    </h1>

                    <p className="mt-2 text-sm text-gray-500">
                        Login to analyze and improve your academic performance.
                    </p>

                </div>

                <form className="space-y-5">

                    {/* USERNAME */}
                    <div>

                        <label
                            htmlFor="Username"
                            className="block text-sm font-medium text-gray-700 mb-1"
                        >
                            Username
                        </label>

                        <input
                            id="Username"
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            placeholder="Enter your username"
                            className="w-full px-3 py-2.5
                            border border-gray-300
                            rounded-md
                            text-sm text-gray-800
                            focus:outline-none
                            focus:ring-2
                            focus:ring-blue-500
                            focus:border-blue-500"
                        />

                    </div>

                    {/* PASSWORD */}
                    <div>

                        <label
                            htmlFor="Password"
                            className="block text-sm font-medium text-gray-700 mb-1"
                        >
                            Password
                        </label>

                        <input
                            id="Password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Enter your password"
                            className="w-full px-3 py-2.5
                            border border-gray-300
                            rounded-md
                            text-sm text-gray-800
                            focus:outline-none
                            focus:ring-2
                            focus:ring-blue-500
                            focus:border-blue-500"
                        />

                    </div>

                    {/* LOGIN BUTTON */}
                    <button
                        type="button"
                        onClick={LoginButton}
                        className="w-full
                        bg-blue-600
                        text-white
                        py-2.5
                        rounded-md
                        text-sm
                        font-medium
                        hover:bg-blue-700
                        focus:outline-none
                        focus:ring-2
                        focus:ring-blue-500
                        transition"
                    >
                        Login
                    </button>

                    {/* REGISTER */}
                    <div className="text-center text-sm text-gray-600 pt-1">

                        Don't have an account?{" "}

                        <Link
                            to="/register"
                            className="text-blue-600 font-medium hover:text-blue-700"
                        >
                            Register
                        </Link>

                    </div>

                </form>

            </div>
        </div>
    )
}

export default Login
