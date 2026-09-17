import axios from "axios"
import { useEffect, useRef, useState } from "react"
import ReactMarkdown from "react-markdown"
import { autoLogout } from "../lib/utils"
import { useNavigate } from "react-router-dom"
import { toast } from "sonner"

type FeedbackResponse = {
    Feedback: string
}

type AnalysisResponse = {
    id: number
    status: "processing" | "completed" | "failed"
    analysis: string
}

type StartAnalysisResponse = {
    id: number
    status: "processing"
    message: string
}

function Dashboard() {
    const [loading, setLoading] = useState(false)
    const [image, setImage] = useState<File | null>(null)
    // const [analysisId, setAnalysisId] = useState<number | null>(null)
    const [fetchData, setFetchData] = useState<FeedbackResponse | null>(null)
    const [showCompleted, setShowCompleted] = useState(false)
    const navigate = useNavigate()
    const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

    const stopPolling = () => {
        if (intervalRef.current) {
            clearInterval(intervalRef.current)
            intervalRef.current = null
        }
    }

    const checkAnalysis = async (analysisId: number) => {
        try {
            const token = localStorage.getItem("access_token")

            const res = await axios.get<AnalysisResponse>(
                `http://127.0.0.1:8000/analysis/${analysisId}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            )

            // Still processing
            if (res.data.status === "processing") {
                setLoading(true)
                return "processing"
            }

            // Completed
            if (res.data.status === "completed") {
                setLoading(false)
                stopPolling()

                localStorage.removeItem("active_analysis_id")

                // Show completion animation first
                setShowCompleted(true)

                setTimeout(() => {
                    setFetchData({
                        Feedback: res.data.analysis
                    })

                    setShowCompleted(false)
                }, 3000)
                toast.success("Analysis completed successfully")
                return "completed"
            }

            // Failed
            if (res.data.status === "failed") {

                setLoading(false)
                stopPolling()

                localStorage.removeItem("active_analysis_id")

                return "failed"
            }

            return null

        } catch (err: any) {
            console.log("ANALYSIS STATUS ERROR:", err)

            setLoading(false)
            stopPolling()
            if (err.message?.status === 401) {
                autoLogout(navigate)
                return
            }
        }
    }


    const startPolling = (analysisId: number) => {

        stopPolling()

        intervalRef.current = setInterval(async () => {

            const status = await checkAnalysis(analysisId)

            if (status === "completed" || status === "failed") {
                stopPolling()
            }

        }, 6000)
    }


    const dashboardBtn = async () => {

        if (!image) return

        try {
            setLoading(true)
            setFetchData(null)

            const token = localStorage.getItem("access_token")

            const formData = new FormData()
            formData.append("image", image)

            const res = await axios.post<StartAnalysisResponse>(
                "http://127.0.0.1:8000/dashboard",
                formData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            )

            if (res.data.status === "processing") {

                const analysisId = res.data.id

                // Remember the running analysis
                localStorage.setItem(
                    "active_analysis_id",
                    String(analysisId)
                )

                // Check once immediately
                const status = await checkAnalysis(analysisId)

                // ONLY start polling if it is still processing
                if (status === "processing") {
                    startPolling(analysisId)
                }
            }

        } catch (err: any) {

            setLoading(false)
            stopPolling()
            if (err.message?.status === 401) {
                autoLogout(navigate)
                return
            }
        }
    }


    useEffect(() => {

        const activeAnalysisId = localStorage.getItem("active_analysis_id")

        if (activeAnalysisId) {

            const analysisId = Number(activeAnalysisId)

            const resumeAnalysis = async () => {

                const status = await checkAnalysis(analysisId)

                if (status === "processing") {
                    setLoading(true)
                    startPolling(analysisId)
                }
            }

            resumeAnalysis()
        }

        return () => {
            stopPolling()
        }

    }, [])

    return (
        <div className="min-h-screen bg-linear-to-br bg-[#F6F8FC] p-6">

            <div className="mx-auto max-w-7xl">

                {/* Header */}
                <div className="mb-8">
                    <p className="text-sm font-semibold text-indigo-600 uppercase tracking-wider">
                        AI Student Performance Analysis
                    </p>

                    <p className="mt-3 max-w-3xl text-slate-500">
                        Upload a handwritten or printed answer sheet and receive detailed AI
                        feedback, conceptual strengths, mistakes, and improvement suggestions.
                    </p>
                </div>

                {/* Dashboard */}
                <div className="grid lg:grid-cols-12 gap-6">

                    {/* LEFT SIDEBAR */}
                    <div className="lg:col-span-4">

                        <div className="rounded-3xl border border-white/70 bg-white/80 backdrop-blur-xl shadow-lg p-5 sticky top-24">

                            <h2 className="text-lg font-bold text-slate-800">
                                Upload Paper
                            </h2>

                            <p className="text-sm text-slate-500 mt-1 mb-4">
                                PNG • JPG • JPEG
                            </p>

                            <label
                                htmlFor="testImage"
                                className="group flex h-72 cursor-pointer items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-slate-50 hover:border-indigo-400 transition"
                            >
                                {image ? (
                                    <img
                                        src={URL.createObjectURL(image)}
                                        alt="Preview"
                                        className="h-full w-full rounded-2xl object-contain p-3"
                                    />
                                ) : (
                                    <div className="text-center px-6">

                                        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-indigo-100">
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

                                        <h3 className="font-semibold text-slate-700">
                                            Select Test Image
                                        </h3>

                                        <p className="mt-2 text-sm text-slate-500">
                                            Click to upload your answer sheet
                                        </p>

                                    </div>
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

                            {image && (
                                <div className="mt-3 rounded-xl bg-slate-100 px-3 py-2">
                                    <p className="truncate text-sm font-medium text-slate-700">
                                        {image.name}
                                    </p>
                                </div>
                            )}

                            <button
                                type="button"
                                onClick={() => {
                                    if (!image) {
                                        toast.warning("Please select a test paper first")
                                        return
                                    }

                                    dashboardBtn()
                                }}
                                disabled={!image || loading
                                }
                                className="mt-5 w-full rounded-xl bg-linear-to-r from-indigo-600 to-violet-600 py-3 font-semibold text-white shadow-lg transition hover:-translate-y-1 disabled:opacity-50"
                            >
                                {loading ? (<div className="cursor-not-allowed">Analyzing...</div>) : (<div>Analyze Paper</div>)}
                            </button>

                        </div>
                    </div>

                    {/* RIGHT CONTENT */}
                    <div className="lg:col-span-8">

                        <div className="rounded-3xl border border-white/70 bg-white/80 backdrop-blur-xl shadow-lg p-8">

                            <div className="mb-6 flex items-center justify-between">

                                <div>
                                    <p className="text-sm font-semibold text-indigo-600 uppercase">
                                        AI Report
                                    </p>

                                    <h2 className="text-3xl font-bold text-slate-900 mt-1">
                                        Performance Feedback
                                    </h2>
                                </div>

                                {fetchData && (
                                    <div className="rounded-full bg-emerald-100 px-3 py-1 text-sm font-semibold text-emerald-700">
                                        Generated
                                    </div>
                                )}

                            </div>

                            {loading ? (
                                <div className="relative min-h-130 overflow-hidden rounded-2xl p-0.5 cursor-wait">

                                    {/* Static colorful border */}
                                    <div className="absolute inset-0 rounded-2xl bg-linear-to-r from-indigo-500 via-fuchsia-500 to-cyan-400" />

                                    {/* ONE moving light */}
                                    <div className="absolute inset-[-50%] animate-[borderMove_4s_linear_infinite] bg-[conic-gradient(from_0deg,transparent_0deg,transparent_300deg,#6366f1_325deg,#ec4899_340deg,#06b6d4_355deg,transparent_360deg)]" />

                                    {/* Card */}
                                    <div className="relative h-full min-h-130 rounded-2xl bg-slate-50 p-6">

                                        {/* Top */}
                                        <div className="mb-6 flex items-end gap-2 ">

                                            {/* One stable colorful dot */}

                                            <span className="ml-2 text-[20px] font-medium text-slate-600 flex gap-3 items-center">
                                                <div className="h-3 w-3 rounded-full bg-linear-to-r from-indigo-500 to-fuchsia-500 shadow-md shadow-fuchsia-300"></div>
                                                AI is generating feedback
                                            </span>
                                            <div className="flex gap-1 pb-0.5">
                                                <div className="h-1.5 w-1.5 rounded-full bg-indigo-500 animate-bounce"></div>

                                                <div
                                                    className="h-1.5 w-1.5 rounded-full bg-violet-500 animate-bounce"
                                                    style={{ animationDelay: "0.15s" }}
                                                ></div>

                                                <div
                                                    className="h-1.5 w-1.5 rounded-full bg-fuchsia-500 animate-bounce"
                                                    style={{ animationDelay: "0.3s" }}
                                                ></div>
                                            </div>

                                        </div>

                                        {/* Loading rectangles */}
                                        <div className="space-y-4">

                                            <div className="relative h-6 w-2/3 overflow-hidden rounded-lg bg-slate-200">
                                                <div className="absolute inset-0 animate-[shimmer_1.4s_infinite] bg-linear-to-r from-transparent via-white/70 to-transparent" />
                                            </div>

                                            <div className="relative h-20 overflow-hidden rounded-xl bg-slate-200">
                                                <div className="absolute inset-0 animate-[shimmer_1.4s_infinite] bg-linear-to-r from-transparent via-white/70 to-transparent" />
                                            </div>

                                            <div className="relative h-16 overflow-hidden rounded-xl bg-slate-200">
                                                <div className="absolute inset-0 animate-[shimmer_1.4s_infinite] bg-linear-to-r from-transparent via-white/70 to-transparent" />
                                            </div>

                                            <div className="relative h-24 overflow-hidden rounded-xl bg-slate-200">
                                                <div className="absolute inset-0 animate-[shimmer_1.4s_infinite] bg-linear-to-r from-transparent via-white/70 to-transparent" />
                                            </div>

                                            <div className="relative h-12 w-1/2 overflow-hidden rounded-lg bg-slate-200">
                                                <div className="absolute inset-0 animate-[shimmer_1.4s_infinite] bg-linear-to-r from-transparent via-white/70 to-transparent" />
                                            </div>

                                        </div>

                                    </div>

                                    <style>{`

        /* One light travelling around the entire box */
        @keyframes borderMove {
            from {
                transform: rotate(0deg);
            }

            to {
                transform: rotate(360deg);
            }
        }

        /* Loading shimmer */
        @keyframes shimmer {
            0% {
                transform: translateX(-100%);
            }

            100% {
                transform: translateX(100%);
            }
        }

        @keyframes bounce {
  0%, 100% {
    transform: translateY(-65%);
    animation-timing-function: cubic-bezier(0.8, 0, 1, 1);
  }
  50% {
    transform: none;
    animation-timing-function: cubic-bezier(0, 0, 0.2, 1);
  }
}
    `}</style>

                                </div>
                            ) : showCompleted ? (

                                <div className="flex min-h-130 flex-col items-center justify-center text-center">

                                    {/* Animated check */}
                                    <div className="relative flex h-24 w-24 items-center justify-center">

                                        <div className="absolute inset-0 rounded-full bg-emerald-400/20 animate-ping"></div>

                                        <div className="relative flex h-20 w-20 items-center justify-center rounded-full bg-linear-to-br from-emerald-400 to-cyan-500 shadow-lg shadow-emerald-300/40">

                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                className="h-10 w-10 text-white animate-[checkScale_0.5s_ease-out]"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                stroke="currentColor"
                                                strokeWidth={2.5}
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    d="M5 13l4 4L19 7"
                                                />
                                            </svg>
                                            <style>{` @keyframes checkScale {
  0%, 100% {
    transform: scale(115%);
    animation-timing-function: cubic-bezier(0.8, 0, 1, 1);
  }
  50% {
    transform: none;
    animation-timing-function: cubic-bezier(0, 0, 0.2, 1);
  }
}`}</style>

                                        </div>

                                    </div>

                                    <h3 className="mt-7 text-2xl font-bold text-slate-800">
                                        Analysis Completed!
                                    </h3>

                                    <p className="mt-2 text-slate-500">
                                        Your performance report is ready.
                                    </p>
                                </div>

                            ) : fetchData ? (
                                <div className="min-h-130 max-h-130 overflow-y-auto hide-scrollbar rounded-2xl p-3 border border-slate-300">

                                    <div className="prose prose-slate max-w-none
                  prose-headings:text-slate-900
                  prose-h2:text-2xl
                  prose-h3:text-xl
                  prose-strong:text-slate-800
                  prose-p:text-slate-600
                  prose-li:text-slate-600
                  prose-ul:space-y-1">
                                        <ReactMarkdown>
                                            {fetchData.Feedback}
                                        </ReactMarkdown>
                                    </div>

                                </div>
                            ) : (
                                <div className="flex min-h-130 flex-col items-center justify-center text-center">

                                    <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-indigo-100">
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            className="h-10 w-10 text-indigo-600"
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

                                    <h3 className="text-2xl font-bold text-slate-800">
                                        Ready for AI Analysis
                                    </h3>

                                    <p className="mt-3 max-w-md text-slate-500 leading-7">
                                        Upload your test paper from the left panel and click
                                        **Analyze Paper**. Your complete performance report will appear here.
                                    </p>

                                </div>
                            )}

                        </div>

                    </div>

                </div>
            </div >
        </div >
    )
}

export default Dashboard