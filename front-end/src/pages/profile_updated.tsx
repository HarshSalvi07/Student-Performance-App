import axios from "axios"
import { useState } from "react"

type ProfileUpdateProps = {
    currentImage: string
    username: string
    age: number
    studentClass: string
    description: string
    onClose: () => void
}

function ProfileUpdate({
    currentImage,
    username: initialUsername,
    age: initialAge,
    studentClass: initialStudentClass,
    description: initialDescription,
    onClose
}: ProfileUpdateProps) {

    const [image, setImage] = useState<File | null>(null)

    const [username, setUsername] = useState(initialUsername)
    const [age, setAge] = useState(initialAge)
    const [studentClass, setStudentClass] = useState(initialStudentClass)
    const [description, setDescription] = useState(initialDescription)

    const update = async () => {
        try {
            const token = localStorage.getItem("access_token")

            const userData = {
                username,
                age,
                studentClass,
                description
            }

            const formData = new FormData()

            formData.append(
                "user",
                JSON.stringify(userData)
            )

            if (image) {
                formData.append("image", image)
            }

            const res = await axios.put(
                "http://127.0.0.1:8000/profile_update",
                formData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            )

            console.log(res.data)

            // Close only after successful update
            onClose()

        } catch (error: any) {

            console.log("STATUS:", error.response?.status)
            console.log("DETAIL:", error.response?.data?.detail)

        }
    }

    return (
        <div>

            {/* Close button */}
            <button
                onClick={onClose}
                className="absolute right-4 top-4 text-xl text-slate-400 hover:text-slate-700"
            >
                ✕
            </button>

            <h2 className="mb-5 text-xl font-bold text-slate-800">
                Update Profile
            </h2>

            <div className="space-y-4">

                {/* Current Image */}
                {currentImage && (
                    <div className="flex justify-center">
                        <img
                            src={`http://127.0.0.1:8000/${currentImage}`}
                            alt="Current Profile"
                            className="h-24 w-24 rounded-full object-cover border-4 border-indigo-100"
                        />
                    </div>
                )}

                {/* Image */}
                <div>
                    <label className="mb-1 block font-medium text-slate-700">
                        Profile Image
                    </label>

                    <input
                        type="file"
                        accept="image/*"
                        onChange={(e) =>
                            setImage(e.target.files?.[0] || null)
                        }
                        className="w-full rounded-lg border border-slate-300 p-2"
                    />
                </div>

                {/* Username */}
                <div>
                    <label className="mb-1 block font-medium text-slate-700">
                        Username
                    </label>

                    <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="w-full rounded-lg border border-slate-300 p-3 outline-none text-gray-400 focus:text-black focus:border-indigo-500 "
                    />
                </div>

                {/* Age */}
                <div>
                    <label className="mb-1 block font-medium text-slate-700">
                        Age
                    </label>

                    <input
                        type="number"
                        value={age}
                        onChange={(e) =>
                            setAge(Number(e.target.value))
                        }
                        className="w-full rounded-lg border border-slate-300 p-3 outline-none text-gray-400 focus:text-black focus:border-indigo-500"
                    />
                </div>

                {/* Class */}
                <div>
                    <label className="mb-1 block font-medium text-slate-700">
                        Class
                    </label>

                    <input
                        type="text"
                        value={studentClass}
                        onChange={(e) =>
                            setStudentClass(e.target.value)
                        }
                        className="w-full rounded-lg border border-slate-300 text-gray-400 focus:text-black p-3 outline-none focus:border-indigo-500"
                    />
                </div>

                {/* Description */}
                <div>
                    <label className="mb-1 block font-medium text-slate-700">
                        Description
                    </label>

                    <textarea
                        value={description}
                        onChange={(e) =>
                            setDescription(e.target.value)
                        }
                        rows={4}
                        className="w-full rounded-lg border text-gray-400 focus:text-black border-slate-300 p-3 outline-none focus:border-indigo-500"
                    />
                </div>

                {/* Update button */}
                <button
                    onClick={update}
                    className="w-full rounded-xl bg-indigo-600 px-6 py-3 font-semibold text-white shadow-md transition hover:bg-indigo-700"
                >
                    Update Profile
                </button>

            </div>
        </div>
    )
}

export default ProfileUpdate