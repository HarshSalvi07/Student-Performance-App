import axios from "axios"
import { useEffect, useState } from "react"
import ReactMarkdown from "react-markdown"
import DeleteHistory from "./delete"
import { useNavigate } from "react-router-dom"
import { autoLogout } from "../lib/utils"
import {
    Alert,
    AlertDescription,
    AlertTitle,
} from "../components/ui/alert"

type HistoryItem = {
    id: number
    upload: string
    analysis: string
    createdAt: string
}

function History() {
    const [loading, setLoading] = useState(true)
    const navigate = useNavigate()
    const [history, setHistory] = useState<HistoryItem[]>([])
    const [selected, setSelected] = useState<HistoryItem | null>(null)
    const [error, setError] = useState("")

    useEffect(() => {
        const getData = async () => {
            try {
                setLoading(true)
                setError("")

                const token = localStorage.getItem("access_token")

                const res = await axios.get(
                    "http://127.0.0.1:8000/history",
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                )

                setHistory(res.data)

            } catch (error: any) {

                if (error.response?.status === 401) {
                    autoLogout(navigate)
                    return
                }

                setError(
                    "Your previous analyses couldn't be loaded. Please refresh and try again."
                )

            } finally {
                setLoading(false)
            }
        }

        getData()
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
                            Loading History
                        </h2>

                        <p className="mt-2 text-sm text-slate-500">
                            Fetching your previous AI performance reports...
                        </p>

                        {/* Skeleton Cards */}
                        <div className="mt-8 w-full space-y-4">

                            <div className="rounded-2xl border border-slate-200 p-4">
                                <div className="flex gap-4">
                                    <div className="h-20 w-20 rounded-xl bg-slate-200 animate-pulse"></div>

                                    <div className="flex-1 space-y-2">
                                        <div className="h-4 w-2/3 rounded bg-slate-200 animate-pulse"></div>
                                        <div className="h-3 rounded bg-slate-200 animate-pulse"></div>
                                        <div className="h-3 w-5/6 rounded bg-slate-200 animate-pulse"></div>
                                    </div>
                                </div>
                            </div>

                            <div className="rounded-2xl border border-slate-200 p-4">
                                <div className="flex gap-4">
                                    <div className="h-20 w-20 rounded-xl bg-slate-200 animate-pulse"></div>

                                    <div className="flex-1 space-y-2">
                                        <div className="h-4 w-1/2 rounded bg-slate-200 animate-pulse"></div>
                                        <div className="h-3 rounded bg-slate-200 animate-pulse"></div>
                                        <div className="h-3 w-3/4 rounded bg-slate-200 animate-pulse"></div>
                                    </div>
                                </div>
                            </div>

                        </div>

                    </div>

                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-linear-to-br bg-[#F6F8FC] py-10 px-4">

            <div className="mx-auto max-w-6xl">

                {/* Header */}
                <div className="mb-8">
                    <p className="text-sm font-semibold text-indigo-600 uppercase tracking-wider">
                        Student Records
                    </p>

                    <h1 className="mt-2 text-3xl font-bold text-slate-900">
                        Analysis History
                    </h1>

                    <p className="mt-2 text-slate-500">
                        Review all your previous AI performance reports and uploaded test papers.
                    </p>
                </div>

                {/* Empty State / History */}
                {error ? (
                    <div className="flex min-h-130 items-center justify-center px-4">

                        <Alert
                            variant="destructive"
                            className="max-w-xl"
                        >
                            <AlertTitle>
                                Unable to Load History
                            </AlertTitle>

                            <AlertDescription>
                                {error}
                            </AlertDescription>
                        </Alert>

                    </div>

                ) : history.length === 0 ? (
                    <div className="rounded-3xl border border-slate-200 bg-white/80 backdrop-blur-xl p-12 text-center shadow-lg">
                        <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-indigo-100">
                            <span className="text-4xl">📄</span>
                        </div>

                        <h2 className="text-xl font-semibold text-slate-800">
                            No Analysis Yet
                        </h2>

                        <p className="mt-2 text-slate-500">
                            Upload your first test paper to generate an AI performance report.
                        </p>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {history.map((item) => (
                            <div
                                key={item.id}
                                onClick={() => setSelected(item)}
                                className="cursor-pointer rounded-3xl border border-white/70 bg-white/80 backdrop-blur-xl p-5 shadow-[0_10px_35px_rgba(79,70,229,0.08)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_18px_40px_rgba(79,70,229,0.12)]"
                            >
                                <div className="flex flex-col gap-5 md:flex-row">

                                    {/* Image */}
                                    <img
                                        src={`http://127.0.0.1:8000/${item.upload}`}
                                        alt="Uploaded Test"
                                        className="h-48 w-full rounded-2xl object-cover md:h-40 md:w-52"
                                    />

                                    {/* Content */}
                                    <div className="flex flex-1 flex-col">

                                        <h2 className="text-xl font-bold text-slate-900">
                                            Test Paper Analysis
                                        </h2>
                                        <p className="mt-3 line-clamp-4 leading-7 text-slate-600">
                                            {item.analysis}
                                        </p>

                                        <div>
                                            <div className="mt-auto pt-5 border-t border-slate-100 items-center flex justify-between">

                                                <p className="text-sm text-slate-400 items-center">
                                                    {new Date(item.createdAt).toLocaleString()}
                                                </p>

                                                <div
                                                    onClick={(e) => e.stopPropagation()}
                                                >
                                                    <DeleteHistory
                                                        id={item.id}
                                                        onDelete={() => {
                                                            setHistory((prev) =>
                                                                prev.filter(
                                                                    (historyItem) => historyItem.id !== item.id
                                                                )
                                                            )
                                                        }}
                                                    />
                                                </div>

                                            </div>
                                        </div>


                                    </div>

                                </div>
                            </div>
                        ))}
                    </div>
                )}

            </div>
            {selected && (
                <div
                    onClick={() => setSelected(null)}
                    className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
                >
                    <div
                        onClick={(e) => e.stopPropagation()}
                        className="w-full max-w-5xl max-h-[90vh] overflow-hidden rounded-3xl bg-white shadow-2xl"
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-5">
                            <div>
                                <p className="text-sm font-semibold text-indigo-600 uppercase">
                                    AI Performance Report
                                </p>

                                <h2 className="text-2xl font-bold text-slate-900">
                                    Test Paper Analysis
                                </h2>
                            </div>

                            <button
                                onClick={() => setSelected(null)}
                                className="h-10 w-10 rounded-full hover:bg-slate-300 text-slate-500 text-xl"
                            >
                                ✕
                            </button>
                        </div>

                        {/* Content */}
                        <div className="grid lg:grid-cols-5 h-[75vh]">

                            {/* Image */}
                            <div className="lg:col-span-2 border-r border-slate-200 bg-slate-50 p-5">
                                <img
                                    src={`http://127.0.0.1:8000/${selected.upload}`}
                                    alt="Test Paper"
                                    className="h-full w-full rounded-2xl object-contain bg-white"
                                />
                            </div>

                            {/* Feedback */}
                            <div className="lg:col-span-3 p-6 overflow-y-auto">

                                <p className="mb-4 text-sm text-slate-400">
                                    {new Date(selected.createdAt).toLocaleString()}
                                </p>

                                <div className="prose prose-slate max-w-none prose-headings:text-slate-900 prose-strong:text-slate-800 prose-p:leading-7">
                                    <ReactMarkdown>
                                        {selected.analysis}
                                    </ReactMarkdown>
                                </div>

                            </div>

                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default History