// import axios from "axios"
// import { useState } from "react"
// import { Link } from "react-router-dom"


// function Register() {

//     const [image, setImage] = useState<File | null>(null)
//     const [username, setUsername] = useState('')
//     const [age, setAge] = useState(0)
//     const [description, setDescription] = useState('')
//     const [studentClass, setStudentClass] = useState('')
//     const [email, setEmail] = useState('')
//     const [create_password, setCreatePassword] = useState('')
//     const [confirm_password, setConfirmPassword] = useState('')

//     const registerButton = async () => {
//         try {
//             const form_data = new FormData()

//             const user = {
//                 username,
//                 age,
//                 description,
//                 studentClass,
//                 email,
//                 create_password,
//                 confirm_password,
//             }

//             form_data.append("user", JSON.stringify(user))

//             if (image) {
//                 form_data.append("image", image)
//             }

//             const res = await axios.post("http://127.0.0.1:8000/register", form_data);
//         }
//         catch (error: any) {
//             console.log("STATUS:", error.response?.status);
//             console.log("DETAIL:", error.response?.data?.detail);
//         }
//     }

//     return (
//         <div>
//             <form>
//                 {/* IMAGE */}
//                 <label htmlFor="Image">Image</label>
//                 <input id="Image" type="file" accept="image/" onChange={(e) => {
//                     const file = e.target.files?.[0]
//                     if (file) { setImage(file) }
//                 }} />
//                 {/* USERNAME */}
//                 <label htmlFor="Username">Username</label>
//                 <input id="Username" type="text" value={username} onChange={(e) => setUsername(e.target.value)} />
//                 {/* AGE */}
//                 <label htmlFor="Age">Age</label>
//                 <input id="Age" type="number" value={age} onChange={(e) => setAge(Number(e.target.value))} />
//                 {/* DESCRIPTION */}
//                 <label htmlFor="Description">Description</label>
//                 <input id="Description" type="text" value={description} onChange={(e) => setDescription(e.target.value)} />
//                 {/* STUDENT CLASS */}
//                 <label htmlFor="Standard">Standard</label>
//                 <input id="Standard" type="text" value={studentClass} onChange={(e) => setStudentClass(e.target.value)} />
//                 {/* EMAIL */}
//                 <label htmlFor="Email">Email</label>
//                 <input id="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
//                 {/* CREATE PASSWORD */}
//                 <label htmlFor="Password">Create password</label>
//                 <input id="Password" type="password" value={create_password} onChange={(e) => setCreatePassword(e.target.value)} />
//                 {/* CONFIRM PASSWORD */}
//                 <label htmlFor="Password">Confirm password</label>
//                 <input id="Password" type="password" value={confirm_password} onChange={(e) => setConfirmPassword(e.target.value)} />

//                 <button type="button" onClick={registerButton}>Submit</button>
//                 <h3><Link to={"/login"}>Login</Link></h3>
//             </form>
//         </div>
//     )
// }

// export default Register

import axios from "axios"
import { useState } from "react"
import { Link } from "react-router-dom"

function Register() {

    const [image, setImage] = useState<File | null>(null)
    const [username, setUsername] = useState('')
    const [age, setAge] = useState(0)
    const [description, setDescription] = useState('')
    const [studentClass, setStudentClass] = useState('')
    const [email, setEmail] = useState('')
    const [create_password, setCreatePassword] = useState('')
    const [confirm_password, setConfirmPassword] = useState('')

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
    }

    return (
        <div className="min-h-screen w-full bg-gray-50 flex items-center justify-center px-4 py-10">

            <div className="w-full max-w-2xl bg-white rounded-xl border border-gray-400 shadow-2xl p-6 sm:p-8">

                {/* HEADER */}
                <div className="text-center mb-8">
                    <h1 className="text-2xl font-semibold text-gray-800">
                        Create Student Account
                    </h1>

                    <p className="mt-2 text-sm text-gray-500">
                        Create your account to analyze and improve your academic performance.
                    </p>
                </div>

                <form className="space-y-5">

                    {/* PROFILE IMAGE */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Profile Image
                        </label>

                        <label
                            htmlFor="Image"
                            className="flex flex-col items-center justify-center
                            w-full h-32
                            border-2 border-dashed border-gray-300
                            rounded-lg
                            bg-gray-50
                            cursor-pointer
                            hover:bg-gray-100
                            hover:border-blue-400
                            transition"
                        >

                            {image ? (
                                <div className="text-center">
                                    <p className="text-sm font-medium text-gray-700">
                                        {image.name}
                                    </p>

                                    <p className="text-xs text-gray-500 mt-1">
                                        Click to change image
                                    </p>
                                </div>
                            ) : (
                                <>
                                    <div className="mb-2 text-gray-400">
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            className="w-8 h-8"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                            strokeWidth={1.5}
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                d="M3 16.5V6.75A2.25 2.25 0 015.25 4.5h13.5A2.25 2.25 0 0121 6.75v9.75m-18 0A2.25 2.25 0 005.25 18.75h13.5A2.25 2.25 0 0021 16.5m-18 0l4.5-4.5a2.25 2.25 0 013.182 0L15 16.5m0 0l2.25-2.25a2.25 2.25 0 013.182 0L21 16.5M9 8.25h.008v.008H9V8.25z"
                                            />
                                        </svg>
                                    </div>

                                    <p className="text-sm text-gray-600">
                                        Click to upload your profile image
                                    </p>

                                    <p className="text-xs text-gray-400 mt-1">
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

                                    if (file) {
                                        setImage(file)
                                    }
                                }}
                            />
                        </label>
                    </div>

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
                            className="w-full px-3 py-2.5 border border-gray-300 rounded-md
                            text-sm text-gray-800
                            focus:outline-none focus:ring-2 focus:ring-blue-500
                            focus:border-blue-500"
                        />
                    </div>

                    {/* AGE + CLASS */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                        {/* AGE */}
                        <div>
                            <label
                                htmlFor="Age"
                                className="block text-sm font-medium text-gray-700 mb-1"
                            >
                                Age
                            </label>

                            <input
                                id="Age"
                                type="number"
                                value={age}
                                onChange={(e) => setAge(Number(e.target.value))}
                                className="w-full px-3 py-2.5 border border-gray-300 rounded-md
                                text-sm
                                focus:outline-none focus:ring-2 focus:ring-blue-500
                                focus:border-blue-500"
                            />
                        </div>

                        {/* CLASS */}
                        <div>
                            <label
                                htmlFor="Standard"
                                className="block text-sm font-medium text-gray-700 mb-1"
                            >
                                Standard / Class
                            </label>

                            <input
                                id="Standard"
                                type="text"
                                value={studentClass}
                                onChange={(e) => setStudentClass(e.target.value)}
                                placeholder="e.g. 10th"
                                className="w-full px-3 py-2.5 border border-gray-300 rounded-md
                                text-sm
                                focus:outline-none focus:ring-2 focus:ring-blue-500
                                focus:border-blue-500"
                            />
                        </div>

                    </div>

                    {/* DESCRIPTION */}
                    <div>
                        <label
                            htmlFor="Description"
                            className="block text-sm font-medium text-gray-700 mb-1"
                        >
                            About You
                        </label>

                        <textarea
                            id="Description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Tell us a little about yourself..."
                            rows={3}
                            className="w-full px-3 py-2.5 border border-gray-300 rounded-md
                            text-sm text-gray-800 resize-none
                            focus:outline-none focus:ring-2 focus:ring-blue-500
                            focus:border-blue-500"
                        />
                    </div>

                    {/* EMAIL */}
                    <div>
                        <label
                            htmlFor="Email"
                            className="block text-sm font-medium text-gray-700 mb-1"
                        >
                            Email
                        </label>

                        <input
                            id="Email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Enter your email"
                            className="w-full px-3 py-2.5 border border-gray-300 rounded-md
                            text-sm
                            focus:outline-none focus:ring-2 focus:ring-blue-500
                            focus:border-blue-500"
                        />
                    </div>

                    {/* PASSWORDS */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                        {/* CREATE PASSWORD */}
                        <div>
                            <label
                                htmlFor="CreatePassword"
                                className="block text-sm font-medium text-gray-700 mb-1"
                            >
                                Create Password
                            </label>

                            <input
                                id="CreatePassword"
                                type="password"
                                value={create_password}
                                onChange={(e) => setCreatePassword(e.target.value)}
                                placeholder="Create password"
                                className="w-full px-3 py-2.5 border border-gray-300 rounded-md
                                text-sm
                                focus:outline-none focus:ring-2 focus:ring-blue-500
                                focus:border-blue-500"
                            />
                        </div>

                        {/* CONFIRM PASSWORD */}
                        <div>
                            <label
                                htmlFor="ConfirmPassword"
                                className="block text-sm font-medium text-gray-700 mb-1"
                            >
                                Confirm Password
                            </label>

                            <input
                                id="ConfirmPassword"
                                type="password"
                                value={confirm_password}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                placeholder="Confirm password"
                                className="w-full px-3 py-2.5 border border-gray-300 rounded-md
                                text-sm
                                focus:outline-none focus:ring-2 focus:ring-blue-500
                                focus:border-blue-500"
                            />
                        </div>

                    </div>

                    {/* SUBMIT */}
                    <button
                        type="button"
                        onClick={registerButton}
                        className="w-full bg-blue-600 text-white py-2.5 rounded-md
                        text-sm font-medium
                        hover:bg-blue-700
                        focus:outline-none focus:ring-2 focus:ring-blue-500
                        transition"
                    >
                        Create Account
                    </button>

                    {/* LOGIN */}
                    <div className="text-center text-sm text-gray-600 pt-1">
                        Already have an account?{" "}
                        <Link
                            to="/login"
                            className="text-blue-600 font-medium hover:text-blue-700"
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
