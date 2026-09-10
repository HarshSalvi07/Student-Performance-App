import axios from "axios"
import { useState } from "react"
import ReactMarkdown from "react-markdown"

type FeedbackResponse = {
    Feedback: string
}

function Dashboard() {
    const [image, setImage] = useState<File | null>(null)
    const [loading, setLoading] = useState(false)
    const [fetchData, setFetchData] = useState<FeedbackResponse | null>(null)

    const dashboardBtn = async () => {
        try {
            setLoading(true)

            const token = localStorage.getItem("access_token")
            const formData = new FormData()

            if (image) {
                formData.append("image", image)
            }

            const res = await axios.post(
                "http://127.0.0.1:8000/dashboard",
                formData,
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                        Authorization: `Bearer ${token}`,
                    },
                }
            )

            setFetchData(res.data)
        } catch (err) {
            console.log(err)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen relative overflow-hidden bg-linear-to-br from-slate-50 via-white to-indigo-50 p-6">

            {/* Background Blur */}
            <div className="absolute -top-20 -left-20 h-72 w-72 rounded-full bg-indigo-200/30 blur-3xl" />
            <div className="absolute bottom-0 right-0 h-80 w-80 rounded-full bg-violet-200/30 blur-3xl" />

            <div className="relative max-w-6xl mx-auto">

                {/* Header */}
                <div className="mb-8">
                    <p className="text-slate-500 mt-2 text-center">
                        Upload your handwritten or printed test paper and receive personalized AI feedback.
                    </p>
                </div>

                {/* Two Columns */}
                <div className="grid lg:grid-cols-2 gap-6">

                    {/* LEFT */}
                    <div className="rounded-3xl border border-white/70 bg-white/80 backdrop-blur-xl shadow-[0_20px_60px_rgba(79,70,229,0.08)] p-6">

                        <h2 className="text-xl font-bold text-slate-800">
                            Upload Test Paper
                        </h2>

                        <p className="text-sm text-slate-500 mt-1 mb-5">
                            Supported format: PNG, JPG and JPEG
                        </p>

                        <label
                            htmlFor="testImage"
                            className="group flex h-72 cursor-pointer flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-linear-to-br from-slate-50 to-indigo-50 transition-all duration-300 hover:-translate-y-1 hover:border-indigo-400 hover:shadow-lg"
                        >
                            {image ? (
                                <div className="text-center px-4">

                                    <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100">
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            className="h-6 w-6 text-emerald-600"
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

                                    <p className="font-semibold text-slate-800 break-all">
                                        {image.name}
                                    </p>

                                    <p className="text-sm text-indigo-600 mt-2">
                                        Click to choose another image
                                    </p>

                                </div>
                            ) : (
                                <>
                                    <div className="mb-4 rounded-full bg-indigo-100 p-4 group-hover:scale-105 transition">
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            className="h-8 w-8 text-indigo-600"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                            strokeWidth={1.6}
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                d="M12 16V8m0 0l-3 3m3-3l3 3M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2"
                                            />
                                        </svg>
                                    </div>

                                    <h3 className="font-semibold text-slate-800">
                                        Drop or Upload Test Paper
                                    </h3>

                                    <p className="text-sm text-slate-500 mt-2 text-center px-8">
                                        Select a clear image of your answer sheet for AI analysis.
                                    </p>
                                </>
                            )}

                            <input
                                id="testImage"
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={(e) => {
                                    const file = e.target.files?.[0]
                                    if (file) setImage(file)
                                }}
                            />
                        </label>

                        <button
                            type="button"
                            onClick={dashboardBtn}
                            disabled={!image || loading}
                            className="mt-5 w-full rounded-xl bg-linear-to-r from-indigo-600 to-violet-600 py-3.5 text-sm font-semibold text-white shadow-[0_12px_30px_rgba(79,70,229,0.35)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_18px_40px_rgba(79,70,229,0.45)] disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0"
                        >
                            {loading ? "Analyzing Paper..." : "Analyze Paper"}
                        </button>

                    </div>

                    {/* RIGHT */}
                    <div className="rounded-3xl border border-white/70 bg-white/80 backdrop-blur-xl shadow-[0_20px_60px_rgba(79,70,229,0.08)] p-6">

                        <h2 className="text-xl font-bold text-slate-800">
                            AI Performance Report
                        </h2>

                        <p className="text-sm text-slate-500 mt-1 mb-5">
                            Strengths, mistakes, and improvement suggestions
                        </p>

                        {loading ? (
                            <div className="flex h-72 flex-col items-center justify-center cursor-progress">

                                <div className="h-14 w-14 rounded-full border-4 border-indigo-100 border-t-indigo-600 animate-spin" />

                                <p className="mt-4 font-medium text-indigo-700">
                                    AI is analyzing your paper...
                                </p>

                                <p className="text-sm text-slate-400 mt-1">
                                    This may take a few seconds
                                </p>

                            </div>
                        ) : fetchData ? (
                            <div className="prose prose-slate max-w-none prose-headings:text-slate-800 prose-strong:text-slate-800 prose-p:text-slate-600 prose-li:text-slate-600">
                                <ReactMarkdown>{fetchData.Feedback}</ReactMarkdown>
                            </div>
                        ) : (
                            <div className="flex h-72 flex-col items-center justify-center text-center">

                                <div className="mb-4 rounded-full bg-slate-100 p-4">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="h-8 w-8 text-slate-400"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                        strokeWidth={1.6}
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="M9.75 17L15 12l-5.25-5"
                                        />
                                    </svg>
                                </div>

                                <h3 className="font-semibold text-slate-700">
                                    Your feedback will appear here
                                </h3>

                                <p className="mt-2 max-w-xs text-sm text-slate-500">
                                    Upload a test paper and click Analyze Paper to generate your personalized AI report.
                                </p>

                            </div>
                        )}

                    </div>

                </div>
            </div>
        </div>
    )
}

export default Dashboard