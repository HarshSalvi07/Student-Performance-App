import axios from "axios"
import { useEffect, useRef, useState } from "react"
import ReactMarkdown from "react-markdown"
import { autoLogout } from "../lib/utils"
import { useNavigate } from "react-router-dom"
import { toast } from "sonner"
import {
    Alert,
    AlertDescription,
    AlertTitle,
} from "../components/ui/alert"
import { AlertCircleIcon } from "lucide-react"

type FeedbackResponse = {
    Feedback: string
}

type AnalysisResponse = {
    id: string
    status: "processing" | "completed" | "failed"
    analysis: string
}

type StartAnalysisResponse = {
    id: string
    status: "processing" | "completed" | "failed"
    message: string
}

function Dashboard() {

    const [loading, setLoading] = useState(false)
    const [image, setImage] = useState<File | null>(null)
    const [subject, setSubject] = useState("")
    const [fetchData, setFetchData] = useState<FeedbackResponse | null>(null)
    const [showCompleted, setShowCompleted] = useState(false)
    const navigate = useNavigate()
    const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
    const [error, setError] = useState("")
    const feedbackRef = useRef<HTMLDivElement>(null)



    const stopPolling = () => {

        if (intervalRef.current) {

            clearInterval(intervalRef.current)

            intervalRef.current = null
        }
    }


    // --------------------------------------------------
    // CHECK ANALYSIS STATUS
    // --------------------------------------------------

    const checkAnalysis = async (analysisId: string) => {

        try {

            const token =
                localStorage.getItem("access_token")
            const res =
                await axios.get<AnalysisResponse>(
                    `http://127.0.0.1:8000/analysis/${analysisId}`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                )


            if (res.data.status === "processing") {

                setLoading(true)

                return "processing"
            }


            if (res.data.status === "completed") {

                setLoading(false)

                stopPolling()

                localStorage.removeItem(
                    "active_analysis_id"
                )


                // Show completed animation
                setShowCompleted(true)


                // After animation show feedback
                setTimeout(() => {

                    setFetchData({
                        Feedback: res.data.analysis
                    })

                    setShowCompleted(false)

                    requestAnimationFrame(() => {
                        feedbackRef.current?.scrollTo({
                            top: 0,
                            behavior: "instant",
                        })
                    })

                }, 3000)


                toast.success(
                    "Analysis completed successfully"
                )

                return "completed"
            }


            // -----------------------------
            // FAILED
            // -----------------------------

            if (res.data.status === "failed") {

                setLoading(false)

                stopPolling()

                localStorage.removeItem(
                    "active_analysis_id"
                )

                toast.error(
                    "Analysis failed. Please try again."
                )

                return "failed"
            }


            return null

        } catch (err: any) {

            console.log(
                "ANALYSIS STATUS ERROR:",
                err
            )

            setLoading(false)

            stopPolling()

            if (err.response?.status === 401) {

                autoLogout(navigate)

                return
            }
        }
    }


    // --------------------------------------------------
    // START POLLING
    // --------------------------------------------------

    const startPolling = (analysisId: string) => {

        stopPolling()


        intervalRef.current =
            setInterval(async () => {

                const status =
                    await checkAnalysis(analysisId)


                if (
                    status === "completed" ||
                    status === "failed"
                ) {

                    stopPolling()
                }

            }, 6000)
    }


    // --------------------------------------------------
    // START ANALYSIS
    // --------------------------------------------------

    const dashboardBtn = async () => {

        // Image validation
        if (!image) {
            toast.warning("Please select a test paper first")
            return
        }

        // Subject validation
        if (!subject.trim()) {
            toast.warning("Please enter the subject")
            return
        }

        try {
            setLoading(true)
            setError("")
            setShowCompleted(false)

            const token = localStorage.getItem("access_token")

            const formData = new FormData()

            formData.append("image", image)
            formData.append("subject", subject.trim())


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

                // Save active analysis
                localStorage.setItem(
                    "active_analysis_id",
                    analysisId
                )

                // Check immediately
                const status = await checkAnalysis(
                    analysisId
                )

                // Start polling if still processing
                if (status === "processing") {
                    startPolling(analysisId)
                }

            } else if (res.data.status === "failed") {

                setLoading(false)

                setError(
                    res.data.message ||
                    "Analysis could not be started."
                )

                toast.error("Analysis failed")

            } else {

                setLoading(false)

                setError(
                    "Unexpected response from server."
                )

                toast.error("Something went wrong")
            }

        } catch (err: any) {

            setLoading(false)

            stopPolling()

            // Session expired
            if (err.response?.status === 401) {
                toast.error(
                    "Your session has expired. Please login again."
                )

                autoLogout(navigate)
                return
            }

            // Backend error
            if (err.response?.data?.detail) {

                toast.error(
                    err.response.data.detail
                )

                setError(
                    err.response.data.detail
                )

                return
            }

            // Unknown error
            toast.error(
                "Unable to start analysis. Please try again."
            )

            setError(
                "Unable to start analysis. Please try again."
            )
        }
    }

    useEffect(() => {

        const activeAnalysisId =
            localStorage.getItem(
                "active_analysis_id"
            )


        if (activeAnalysisId) {

            const resumeAnalysis =
                async () => {

                    const status =
                        await checkAnalysis(
                            activeAnalysisId
                        )


                    if (
                        status === "processing"
                    ) {

                        setLoading(true)

                        startPolling(
                            activeAnalysisId
                        )
                    }
                }


            resumeAnalysis()
        }


        // Cleanup
        return () => {

            stopPolling()
        }

    }, [])


    return (

        <div className="min-h-screen bg-[#F6F8FC] p-6">

            <div className="mx-auto max-w-7xl">


                {/* -------------------------------- */}
                {/* HEADER */}
                {/* -------------------------------- */}

                <div className="mb-8">

                    <p className="ml-1 text-sm font-semibold uppercase tracking-wider text-indigo-600">
                        AI Student Performance Analysis
                    </p>


                    <h1 className=" mt-2 text-3xl font-bold text-slate-900">
                        Analyze Your Test Paper
                    </h1>


                    <p className="mt-3 max-w-3xl text-slate-500">

                        Upload a handwritten or printed answer
                        sheet and receive detailed AI feedback,
                        conceptual strengths, mistakes, and
                        improvement suggestions.

                    </p>

                </div>


                <div className="grid gap-6 lg:grid-cols-12">


                    {/* ================================== */}
                    {/* LEFT SIDE */}
                    {/* ================================== */}

                    <div className="lg:col-span-4">

                        <div className="sticky top-24 rounded-3xl border border-white/70 bg-white/80 p-5 shadow-lg backdrop-blur-xl">


                            {/* TITLE */}

                            <h2 className="text-lg font-bold text-slate-800">
                                Upload Paper
                            </h2>


                            <p className="mt-1 mb-5 text-sm text-slate-500">
                                Upload your answer sheet
                            </p>


                            {/* SUBJECT */}

                            <label className="mb-2 block text-sm font-semibold text-slate-700">
                                Subject
                            </label>


                            <input
                                type="text"
                                value={subject}
                                onChange={(e) =>
                                    setSubject(e.target.value)
                                }
                                placeholder="e.g. Physics"
                                disabled={loading}
                                className="mb-4 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 disabled:bg-slate-100"
                            />


                            {/* IMAGE UPLOAD */}

                            <label
                                htmlFor="testImage"
                                className="group flex h-72 cursor-pointer items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-slate-50 transition hover:border-indigo-400"
                            >

                                {image ? (

                                    <img
                                        src={URL.createObjectURL(image)}
                                        alt="Preview"
                                        className="h-full w-full rounded-2xl object-contain p-3"
                                    />

                                ) : (

                                    <div className="px-6 text-center">

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


                                        <p className="mt-3 text-xs text-slate-400">
                                            PNG • JPG • JPEG
                                        </p>

                                    </div>
                                )}


                                <input
                                    id="testImage"
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    disabled={loading}
                                    onChange={(e) => {

                                        const file =
                                            e.target.files?.[0]

                                        if (file) {

                                            setImage(file)

                                            setFetchData(null)
                                        }
                                        else {
                                            toast.error("Unable to upload profile image")
                                            return
                                        }
                                    }}
                                />

                            </label>


                            {/* FILE NAME */}

                            {image && (

                                <div className="mt-3 rounded-xl bg-slate-100 px-3 py-2">

                                    <p className="truncate text-sm font-medium text-slate-700">
                                        {image.name}
                                    </p>

                                </div>
                            )}


                            {/* ANALYZE BUTTON */}

                            <button
                                type="button"
                                onClick={dashboardBtn}
                                disabled={
                                    !image ||
                                    !subject.trim() ||
                                    loading
                                }
                                className="mt-5 w-full rounded-xl bg-linear-to-r from-indigo-600 to-violet-600 py-3 font-semibold text-white shadow-lg transition hover:-translate-y-1 disabled:cursor-not-allowed disabled:opacity-50"
                            >

                                {loading
                                    ? "Analyzing..."
                                    : "Analyze Paper"}

                            </button>

                        </div>

                    </div>


                    {/* ================================== */}
                    {/* RIGHT SIDE */}
                    {/* ================================== */}

                    <div className="lg:col-span-8">

                        <div className="rounded-3xl border border-white/70 bg-white/80 p-8 shadow-lg backdrop-blur-xl">


                            {/* REPORT HEADER */}

                            <div className="mb-6 flex items-center justify-between">

                                <div>

                                    <p className="text-sm font-semibold uppercase text-indigo-600">
                                        AI Report
                                    </p>


                                    <h2 className="mt-1 text-3xl font-bold text-slate-900">
                                        Performance Feedback
                                    </h2>

                                </div>


                                {fetchData && (

                                    <div className="rounded-full bg-emerald-100 px-3 py-1 text-sm font-semibold text-emerald-700">
                                        Generated
                                    </div>

                                )}

                            </div>


                            {/* ================================== */}
                            {/* LOADING */}
                            {/* ================================== */}
                            <div className="relative h-130 overflow-hidden [overflow-anchor:none]">

                                {/* ================================================= */}
                                {/* PERMANENT FEEDBACK CONTAINER                      */}
                                {/* ================================================= */}

                                <div
                                    ref={feedbackRef}
                                    className="h-full overflow-y-auto hide-scrollbar rounded-2xl border border-slate-300 p-3"
                                >

                                    {fetchData ? (

                                        <div
                                            className="
                    prose
                    prose-slate
                    max-w-none
                    prose-headings:text-slate-900
                    prose-h2:text-2xl
                    prose-h3:text-xl
                    prose-strong:text-slate-800
                    prose-p:text-slate-600
                    prose-li:text-slate-600
                    prose-ul:space-y-1
                "
                                        >
                                            <ReactMarkdown>
                                                {fetchData.Feedback}
                                            </ReactMarkdown>
                                        </div>

                                    ) : (

                                        /* ================================== */
                                        /* EMPTY STATE */
                                        /* ================================== */

                                        <div className="flex h-full flex-col items-center justify-center text-center">

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

                                            <p className="mt-3 max-w-md leading-7 text-slate-500">
                                                Upload your test paper,
                                                select the subject, and click
                                                <strong> Analyze Paper </strong>.
                                                Your complete performance report
                                                will appear here.
                                            </p>

                                        </div>

                                    )}

                                </div>


                                {loading && (

                                    <div className="absolute inset-0 z-20">

                                        <div className="relative h-full overflow-hidden rounded-2xl p-0.5 cursor-wait">

                                            {/* Static border */}

                                            <div className="absolute inset-0 rounded-2xl bg-linear-to-r from-indigo-500 via-fuchsia-500 to-cyan-400" />

                                            {/* Moving light */}

                                            <div className="absolute inset-[-50%] animate-[borderMove_4s_linear_infinite] bg-[conic-gradient(from_0deg,transparent_0deg,transparent_300deg,#6366f1_325deg,#ec4899_340deg,#06b6d4_355deg,transparent_360deg)]" />

                                            {/* Card */}

                                            <div className="relative h-full rounded-2xl bg-slate-50 p-6">

                                                {/* Loading title */}

                                                <div className="mb-6 flex items-center gap-2">

                                                    <div className="h-3 w-3 rounded-full bg-linear-to-r from-indigo-500 to-fuchsia-500 shadow-md shadow-fuchsia-300" ></div>

                                                    <span className="text-[20px] font-medium text-slate-600">
                                                        AI is generating feedback
                                                    </span>

                                                    <div className="flex gap-1 h-5 items-end">

                                                        <div className="h-1.5 w-1.5 animate-bounce rounded-full bg-indigo-500" />

                                                        <div
                                                            className="h-1.5 w-1.5 animate-bounce rounded-full bg-violet-500"
                                                            style={{
                                                                animationDelay: "0.15s",
                                                            }}
                                                        />

                                                        <div
                                                            className="h-1.5 w-1.5 animate-bounce rounded-full bg-fuchsia-500"
                                                            style={{
                                                                animationDelay: "0.3s",
                                                            }}
                                                        />

                                                    </div>

                                                </div>

                                                {/* Skeleton */}

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

                                        </div>

                                    </div>

                                )}


                                {/* ================================================= */}
                                {/* COMPLETED ANIMATION                              */}
                                {/* ================================================= */}

                                {showCompleted && !loading && (

                                    <div className="absolute inset-0 z-20 flex min-h-130 flex-col items-center justify-center bg-slate-50 text-center">

                                        <div className="relative flex h-24 w-24 items-center justify-center">

                                            <div className="absolute inset-0 animate-ping rounded-full bg-emerald-400/20" />

                                            <div className="relative flex h-20 w-20 items-center justify-center rounded-full bg-linear-to-br from-emerald-400 to-cyan-500 shadow-lg shadow-emerald-300/40">

                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    className="h-10 w-10 text-white"
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

                                            </div>

                                        </div>

                                        <h3 className="mt-7 text-2xl font-bold text-slate-800">
                                            Analysis Completed!
                                        </h3>

                                        <p className="mt-2 text-slate-500">
                                            Your performance report is ready.
                                        </p>

                                    </div>

                                )}


                                {/* ================================================= */}
                                {/* ERROR                                             */}
                                {/* ================================================= */}

                                {error && !loading && !showCompleted && (

                                    <div className="absolute inset-0 z-20 flex items-center justify-center bg-slate-50 p-6">

                                        <Alert
                                            variant="destructive"
                                            className="max-w-xl"
                                        >
                                            <AlertCircleIcon />

                                            <AlertTitle>
                                                Analysis Failed
                                            </AlertTitle>

                                            <AlertDescription>
                                                {error}
                                                <br />
                                                Please upload a clearer image and try again.
                                            </AlertDescription>
                                        </Alert>

                                    </div>

                                )}

                            </div>

                        </div>

                    </div>

                </div>

            </div>

        </div>
    )
}

export default Dashboard