import axios from "axios"
import { useEffect, useState } from "react"
import ProfileUpdate from "./profile_updated"

function Profile() {
    const [image, setImage] = useState("")
    const [username, setUsername] = useState("")
    const [age, setAge] = useState(0)
    const [studentClass, setStudentClass] = useState("")
    const [description, setDescription] = useState("")
    const [email, setEmail] = useState("")
    const [preview, setPreview] = useState(false)
    const [showUpdate, setShowUpdate] = useState(false)

    useEffect(() => {
        const profilebtn = async () => {
            try {
                const token = localStorage.getItem("access_token")

                const res = await axios.get(
                    "http://127.0.0.1:8000/profile",
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                )
                setImage(res.data.image)
                setUsername(res.data.username)
                setAge(res.data.age)
                setStudentClass(res.data.studentClass)
                setDescription(res.data.description)
                setEmail(res.data.email)

            } catch (error: any) {
                console.log("STATUS:", error.response?.status)
                console.log("DETAIL:", error.response?.data?.detail)
            }
        }
        profilebtn()
    }, [])

    return (
        <div className="min-h-screen bg-linear-to-br from-slate-50 via-white to-indigo-50 py-10 px-4">

            {showUpdate === false ? (
                <div className="max-w-5xl mx-auto">

                    {/* Header */}
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold text-slate-900 mt-2">
                            My Profile
                        </h1>

                        <p className="text-slate-500 mt-2">
                            View your personal information and academic details.
                        </p>
                    </div>

                    {/* Main Card */}
                    <div className="rounded-[28px] border border-white/70 bg-white/80 backdrop-blur-xl shadow-[0_20px_60px_rgba(79,70,229,0.08)] p-8">

                        {/* Top Section */}
                        <div className="flex flex-col  md:flex-row items-center gap-8">

                            <div className="shrink-0">
                                {image ? (
                                    <img
                                        src={`http://127.0.0.1:8000/${image}`}
                                        alt="Profile"
                                        onClick={() => setPreview(true)}
                                        className="w-56 h-56 rounded-full object-cover border-4 border-indigo-100 shadow-lg cursor-pointer hover:scale-105 transition duration-300"
                                    />
                                ) : (
                                    <div className="w-36 h-36 rounded-full bg-indigo-100 flex items-center justify-center text-5xl font-bold text-indigo-600 shadow-lg">
                                        {username.charAt(0).toUpperCase()}
                                    </div>
                                )}
                            </div>
                            <div className="h-54 mx-6 border border-slate-200"></div>
                            <div className="text-center md:text-left">
                                <h2 className="text-7xl font-bold text-indigo-600">
                                    {username.toUpperCase() || "Student Name"}
                                </h2>
                                <p className="text-indigo-600 font-medium mt-1">
                                    Class {studentClass}
                                </p>

                                <p className="text-slate-500 mt-3 max-w-xl leading-7">
                                    {description || "No description available."}
                                </p>
                            </div>

                        </div>

                        {/* Divider */}
                        <div className="my-8 border-t border-slate-200"></div>

                        {/* Information Grid */}
                        <div className="grid md:grid-cols-2 gap-5">

                            <div className="rounded-2xl bg-slate-50 p-5 border border-slate-200">
                                <p className="text-sm text-slate-500 mb-1">Username</p>
                                <h3 className="text-lg font-semibold text-slate-800">
                                    {username}
                                </h3>
                            </div>

                            <div className="rounded-2xl bg-slate-50 p-5 border border-slate-200">
                                <p className="text-sm text-slate-500 mb-1">Email Address</p>
                                <h3 className="text-lg font-semibold text-slate-800 break-all">
                                    {email}
                                </h3>
                            </div>

                            <div className="rounded-2xl bg-slate-50 p-5 border border-slate-200">
                                <p className="text-sm text-slate-500 mb-1">Age</p>
                                <h3 className="text-lg font-semibold text-slate-800">
                                    {age} Years
                                </h3>
                            </div>

                            <div className="rounded-2xl bg-slate-50 p-5 border border-slate-200">
                                <p className="text-sm text-slate-500 mb-1">Standard / Class</p>
                                <h3 className="text-lg font-semibold text-slate-800">
                                    {studentClass}
                                </h3>
                            </div>

                        </div>

                        {/* About Section */}
                        <div className="mt-6 rounded-2xl bg-linear-to-r from-indigo-50 to-violet-50 border border-indigo-100 p-6">
                            <h3 className="text-lg font-bold text-slate-800 mb-2">
                                About Student
                            </h3>
                            <p className="text-slate-600 leading-7">
                                {description || "No description added yet."}
                            </p>
                        </div>
                        {/* Update */}
                        <button
                            onClick={() => setShowUpdate(true)}
                            className="mt-4 rounded-xl bg-indigo-600 px-5 py-2.5 font-semibold text-white shadow-md transition hover:bg-indigo-700">Update</button>
                    </div>

                </div>) :
                <div>

                    <div className="max-w-5xl mx-auto">

                        {/* Header */}
                        <div className="mb-8">
                            <p className="text-sm font-semibold text-indigo-600 uppercase tracking-wider">
                                Student Profile
                            </p>

                            <h1 className="text-3xl font-bold text-slate-900 mt-2">
                                My Profile
                            </h1>

                            <p className="text-slate-500 mt-2">
                                View your personal information and academic details.
                            </p>
                        </div>

                        {/* Main Card */}
                        <div className="rounded-[28px] border border-white/70 bg-white/80 backdrop-blur-xl shadow-[0_20px_60px_rgba(79,70,229,0.08)] p-8">

                            {/* Top Section */}
                            <div className="grid justify-center md:flex-row items-center gap-8">

                                <div className="shrink-0">
                                    {image ? (
                                        <img
                                            src={`http://127.0.0.1:8000/${image}`}
                                            alt="Profile"
                                            onClick={() => setPreview(true)}
                                            className="w-36 h-36 rounded-full object-cover border-4 border-indigo-100 shadow-lg cursor-pointer hover:scale-105 transition duration-300"
                                        />
                                    ) : (
                                        <div className="w-36 h-36 rounded-full bg-indigo-100 flex items-center justify-center text-5xl font-bold text-indigo-600 shadow-lg">
                                            {username.charAt(0).toUpperCase()}
                                        </div>
                                    )}
                                </div>

                                <div className="text-center">
                                    <h2 className="text-3xl font-bold text-indigo-600">
                                        {username.toUpperCase() || "Student Name"}
                                    </h2>
                                </div>

                            </div>

                            {/* Divider */}
                            <div className="my-8 border-t border-slate-200"></div>

                            {/* Information Grid */}
                            <div className="grid md:grid-cols-2 gap-5">

                                <div className="rounded-2xl bg-slate-50 p-5 border border-slate-200">
                                    <p className="text-sm text-slate-500 mb-1">Username</p>
                                    <h3 className="text-lg font-semibold text-slate-800">
                                        {username}
                                    </h3>
                                </div>

                                <div className="rounded-2xl bg-slate-50 p-5 border border-slate-200">
                                    <p className="text-sm text-slate-500 mb-1">Email Address</p>
                                    <h3 className="text-lg font-semibold text-slate-800 break-all">
                                        {email}
                                    </h3>
                                </div>

                                <div className="rounded-2xl bg-slate-50 p-5 border border-slate-200">
                                    <p className="text-sm text-slate-500 mb-1">Age</p>
                                    <h3 className="text-lg font-semibold text-slate-800">
                                        {age} Years
                                    </h3>
                                </div>

                                <div className="rounded-2xl bg-slate-50 p-5 border border-slate-200">
                                    <p className="text-sm text-slate-500 mb-1">Standard / Class</p>
                                    <h3 className="text-lg font-semibold text-slate-800">
                                        {studentClass}
                                    </h3>
                                </div>

                            </div>

                            {/* About Section */}
                            <div className="mt-6 rounded-2xl bg-linear-to-r from-indigo-50 to-violet-50 border border-indigo-100 p-6">
                                <h3 className="text-lg font-bold text-slate-800 mb-2">
                                    About Student
                                </h3>
                                <p className="text-slate-600 leading-7">
                                    {description || "No description added yet."}
                                </p>
                            </div>
                        </div>
                    </div>
                    {showUpdate && (
                        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
                            <div className="relative max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl">
                                <ProfileUpdate
                                    currentImage={image}
                                    username={username}
                                    age={age}
                                    studentClass={studentClass}
                                    description={description}
                                    onClose={() => setShowUpdate(false)}
                                />
                            </div>
                        </div>)}
                </div>}

            {/* Image Preview */}
            {preview && (
                <div
                    onClick={() => setPreview(false)}
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm"
                >
                    <div
                        onClick={(e) => e.stopPropagation()}
                        className="relative"
                    >
                        <img
                            src={`http://127.0.0.1:8000/${image}`}
                            alt="Profile Preview"
                            className="w-150 h-150 rounded-full object-cover border-8 border-white shadow-2xl"
                        />

                        <button
                            onClick={() => setPreview(false)}
                            className="absolute top-3 right-3 w-10 h-10 rounded-full bg-white text-slate-700 shadow-lg hover:bg-slate-100"
                        >
                            ✕
                        </button>
                    </div>
                </div>
            )}
        </div>
    )
}

export default Profile