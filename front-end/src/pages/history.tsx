import axios from "axios"
import { useEffect, useState } from "react"
import DeleteData from "./delete"

type HistoryItem = {
    id: number
    upload: string
    analysis: string
    createdAt: string
}

function History() {
    const [history, setHistory] = useState<HistoryItem[]>([])

    useEffect(() => {
        const getData = async () => {
            try {
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
            } catch (error) {
                console.log(error)
            }
        }

        getData()
    }, [])

    return (
        <div className="min-h-screen bg-slate-50 p-6">
            <div className="mx-auto max-w-5xl">
                <h1 className="mb-6 text-3xl font-bold text-slate-800">
                    Analysis History
                </h1>

                <p className="text-slate-500">Loading...</p>
                history.length === 0 ?
                <div className="rounded-2xl bg-white p-10 text-center shadow">
                    <p className="text-slate-500">
                        No history available.
                    </p>
                </div>

                <div className="space-y-5">
                    {history.map((item) => (
                        <div
                            key={item.id}
                            className="rounded-2xl bg-white p-5 shadow-md"
                        >
                            <div className="flex flex-col gap-4 md:flex-row md:items-start">
                                <img
                                    src={`http://127.0.0.1:8000/${item.upload}`}
                                    alt="Uploaded"
                                    className="h-36 w-full rounded-xl object-cover md:w-44"
                                />

                                <div className="flex-1">
                                    <div className="mb-2 flex items-center justify-between">
                                        <h2 className="text-lg font-semibold text-slate-800">
                                            Test Analysis
                                        </h2>

                                        <DeleteData id={item.id} />
                                    </div>

                                    <p className="mb-3 text-slate-600 line-clamp-4">
                                        {item.analysis}
                                    </p>

                                    <p className="text-sm text-slate-400">
                                        {new Date(
                                            item.createdAt
                                        ).toLocaleString()}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

            </div>
        </div>
    )
}


export default History