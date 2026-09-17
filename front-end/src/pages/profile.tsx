import axios from "axios"
import { useEffect, useState } from "react"
import ProfileUpdate from "./profile_updated"
import { autoLogout } from "../lib/utils"
import { useNavigate } from "react-router-dom"

function Profile() {
    const [image, setImage] = useState("")
    const [username, setUsername] = useState("")
    const [age, setAge] = useState(0)
    const [studentClass, setStudentClass] = useState("")
    const [description, setDescription] = useState("")
    const [email, setEmail] = useState("")
    const [totalAnalyses, setTotalAnalyses] = useState(0)
    const [preview, setPreview] = useState(false)
    const [showUpdate, setShowUpdate] = useState(false)
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()

    useEffect(() => {
        const getProfile = async () => {
            try {
                setLoading(true)
                const token = localStorage.getItem("access_token")

                const headers = {
                    Authorization: `Bearer ${token}`,
                }

                // Profile
                const profileRes = await axios.get(
                    "http://127.0.0.1:8000/profile",
                    { headers }
                )

                setImage(profileRes.data.image)
                setUsername(profileRes.data.username)
                setAge(profileRes.data.age)
                setStudentClass(profileRes.data.studentClass)
                setDescription(profileRes.data.description)
                setEmail(profileRes.data.email)

                // Existing history endpoint
                const historyRes = await axios.get(
                    "http://127.0.0.1:8000/history",
                    { headers }
                )

                setLoading(false)
                setTotalAnalyses(historyRes.data.length)

            } catch (error: any) {
                console.log("STATUS:", error.response?.status)
                console.log("DETAIL:", error.response?.data?.detail)
                if (error.message?.status === 401) {
                    autoLogout(navigate)
                }
            } finally {
                setLoading(false)
            }
        }

        getProfile()
    }, [])

    if (loading) {
        return (
            <div className="min-h-screen bg-linear-to-br from-slate-50 via-white to-indigo-50 flex items-center justify-center px-4">
                <div className="w-full max-w-md rounded-3xl border border-white/70 bg-white/80 backdrop-blur-xl p-10 shadow-[0_20px_60px_rgba(79,70,229,0.08)]">

                    <div className="flex flex-col items-center text-center">

                        {/* Spinner */}
                        <div className="relative mb-6">
                            <div className="h-16 w-16 rounded-full border-4 border-indigo-100"></div>
                            <div className="absolute inset-0 h-16 w-16 rounded-full border-4 border-transparent border-t-indigo-600 animate-spin"></div>
                        </div>

                        <h2 className="text-xl font-bold text-slate-900">
                            Loading Profile
                        </h2>

                        <p className="mt-2 text-sm text-slate-500">
                            Fetching your personal information and analysis statistics...
                        </p>

                        {/* Skeleton lines */}
                        <div className="mt-8 w-full space-y-3">
                            <div className="h-4 rounded-full bg-slate-200 animate-pulse"></div>
                            <div className="h-4 w-5/6 rounded-full bg-slate-200 animate-pulse"></div>
                            <div className="h-4 w-2/3 rounded-full bg-slate-200 animate-pulse"></div>
                        </div>

                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-linear-to-br bg-[#F6F8FC] px-4 py-10">
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

                {/* Main Profile Card */}
                <div className="rounded-[28px] border border-white/70 bg-white/80 backdrop-blur-xl shadow-[0_20px_60px_rgba(79,70,229,0.08)] p-8">

                    {/* Top Section */}
                    <div className="flex flex-col md:flex-row items-center gap-8">

                        {/* Profile Image */}
                        <div className="shrink-0">
                            {image ? (
                                <img
                                    src={`http://127.0.0.1:8000/${image}?t=${Date.now()}`}
                                    alt="Profile"
                                    onClick={() => setPreview(true)}
                                    className="w-48 h-48 rounded-full object-cover border-4 border-indigo-100 shadow-lg cursor-pointer hover:scale-105 transition duration-300"
                                />
                            ) : (
                                <div className="w-48 h-48 rounded-full bg-indigo-100 flex items-center justify-center text-6xl font-bold text-indigo-600 shadow-lg">
                                    {username.charAt(0).toUpperCase()}
                                </div>
                            )}
                        </div>

                        {/* Vertical Divider */}
                        <div className="hidden md:block h-44 border-l border-slate-200"></div>

                        {/* Student Information */}
                        <div className="text-center md:text-left flex-1">

                            <h2 className="text-4xl font-bold text-indigo-600">
                                {username.toUpperCase()}
                            </h2>

                            <p className="text-indigo-600 font-medium mt-2">
                                {studentClass}
                            </p>

                            <p className="text-slate-500 mt-4 max-w-xl leading-7">
                                {description}
                            </p>

                        </div>

                    </div>

                    {/* Divider */}
                    <div className="my-8 border-t border-slate-200"></div>

                    {/* Information Grid */}
                    <div className="grid md:grid-cols-2 gap-5">

                        {/* Username */}
                        <div className="rounded-2xl bg-slate-50 p-5 border border-slate-200">
                            <p className="text-sm text-slate-500 mb-1">
                                Username
                            </p>

                            <h3 className="text-lg font-semibold text-slate-800">
                                {username}
                            </h3>
                        </div>

                        {/* Email */}
                        <div className="rounded-2xl bg-slate-50 p-5 border border-slate-200">
                            <p className="text-sm text-slate-500 mb-1">
                                Email Address
                            </p>

                            <h3 className="text-lg font-semibold text-slate-800 break-all">
                                {email}
                            </h3>
                        </div>

                        {/* Age */}
                        <div className="rounded-2xl bg-slate-50 p-5 border border-slate-200">
                            <p className="text-sm text-slate-500 mb-1">
                                Age
                            </p>

                            <h3 className="text-lg font-semibold text-slate-800">
                                {age} Years
                            </h3>
                        </div>

                        {/* Class */}
                        <div className="rounded-2xl bg-slate-50 p-5 border border-slate-200">
                            <p className="text-sm text-slate-500 mb-1">
                                Standard / Class
                            </p>

                            <h3 className="text-lg font-semibold text-slate-800">
                                {studentClass}
                            </h3>
                        </div>

                    </div>

                    {/* About Student */}
                    <div className="mt-6 rounded-2xl bg-linear-to-r from-indigo-50 to-violet-50 border border-indigo-100 p-6">

                        <h3 className="text-lg font-bold text-slate-800 mb-2">
                            About Student
                        </h3>

                        <p className="text-slate-600 leading-7">
                            {description}
                        </p>

                    </div>

                    {/* Statistics */}
                    <div className="mt-6">

                        <div className="rounded-2xl bg-indigo-50 border border-indigo-100 p-6">

                            <p className="text-sm font-medium text-indigo-600">
                                Total Analyses Completed
                            </p>

                            <div className="mt-2 flex items-end gap-2">

                                <h3 className="text-4xl font-bold text-slate-900">
                                    {totalAnalyses}
                                </h3>

                                <span className="mb-1 text-slate-500">
                                    analyses
                                </span>

                            </div>

                            <p className="mt-2 text-sm text-slate-500">
                                Tests analyzed by AI
                            </p>

                        </div>

                    </div>

                    {/* Edit Profile Button */}
                    <div className="mt-6 flex justify-end">

                        <button
                            onClick={() => setShowUpdate(true)}
                            className="rounded-xl bg-indigo-600 px-6 py-3 font-semibold text-white shadow-md transition hover:-translate-y-0.5 hover:bg-indigo-800 hover:shadow-lg">
                            Edit Profile
                        </button>

                    </div>

                </div>

            </div>

            {/* Profile Update Modal */}
            {showUpdate && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
                    onClick={() => setShowUpdate(false)}>
                    <div
                        className="relative max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl"
                        onClick={(e) => e.stopPropagation()}>

                        <ProfileUpdate
                            currentImage={image}
                            username={username}
                            age={age}
                            studentClass={studentClass}
                            description={description}
                            onClose={() => setShowUpdate(false)}
                            onSuccess={(data) => {
                                setImage(data.image)
                                setUsername(data.username)
                                setAge(data.age)
                                setStudentClass(data.studentClass)
                                setDescription(data.description)
                            }}
                        />

                    </div>
                </div>
            )}

            {/* Image Preview Modal */}
            {preview && image && (
                <div
                    onClick={() => setPreview(false)}
                    className="fixed inset-0 z-60 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
                    <div
                        onClick={(e) => e.stopPropagation()}
                        className="relative">
                        <img
                            src={`http://127.0.0.1:8000/${image}`}
                            alt="Profile Preview"
                            className="max-h-[80vh] max-w-[80vw] rounded-4xl border-8 border-white shadow-2xl"/>

                        <button
                            onClick={() => setPreview(false)}
                            className="absolute top-3 right-3 w-10 h-10 rounded-full bg-cyan-200 text-slate-700 shadow-lg transition hover:bg-blue-300"
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