import { Link } from "react-router-dom"

function Home() {
    return (
        <div className="min-h-screen bg-[#F6F8FC]">

            {/* Hero Section */}
            <section className="max-w-7xl mx-auto px-6 py-24">
                <div className="grid lg:grid-cols-2 gap-14 items-center">

                    {/* Left */}
                    <div>
                        <p className="inline-block rounded-full bg-indigo-100 px-4 py-1 text-sm font-semibold text-indigo-700">
                            AI Powered Learning Platform
                        </p>

                        <h1 className="mt-6 text-5xl font-bold leading-tight text-slate-900">
                            Student Performance Analysis System
                        </h1>

                        <p className="mt-6 text-lg leading-8 text-slate-600">
                            Upload your handwritten or printed test papers and let AI
                            analyze your answers. Receive detailed feedback, identify
                            mistakes, discover your strengths, and get personalized
                            suggestions on how to improve your academic performance.
                        </p>

                        <div className="mt-8 flex gap-4">
                            <Link
                                to="/register"
                                className="rounded-xl bg-linear-to-r from-indigo-600 to-violet-600 px-6 py-3 font-semibold text-white transition hover:scale-110 hover:shadow-lg/90 hover:shadow-indigo-500/70"
                            >
                                Get Started
                            </Link>

                        </div>
                    </div>

                    {/* Right Illustration */}
                    <div className="rounded-3xl bg-white/80 backdrop-blur border border-white shadow-2xl p-8">
                        <div className="space-y-10">

                            <div className="rounded-xl bg-indigo-50 p-4 hover:shadow-lg hover:shadow-indigo-300/90 transition hover:scale-108 hover:-translate-y-3">
                                <h3 className="font-semibold text-indigo-700">
                                    📄 Upload Test Paper
                                </h3>
                                <p className="mt-1 text-sm text-slate-600">
                                    Select an image of your handwritten or printed answer sheet.
                                </p>
                            </div>

                            <div className="rounded-xl bg-violet-50 p-4 hover:shadow-lg hover:shadow-indigo-300/90 transition hover:scale-108 hover:-translate-y-3">
                                <h3 className="font-semibold text-violet-700">
                                    🤖 AI Analysis
                                </h3>
                                <p className="mt-1 text-sm text-slate-600">
                                    OCR reads your paper while AI understands your answers and concepts.
                                </p>
                            </div>

                            <div className="rounded-xl bg-emerald-50 p-4 hover:shadow-lg hover:shadow-indigo-300/90 transition hover:scale-108 hover:-translate-y-3">
                                <h3 className="font-semibold text-emerald-700">
                                    📈 Performance Report
                                </h3>
                                <p className="mt-1 text-sm text-slate-600">
                                    Get strengths, weaknesses, marks improvement tips, and learning guidance.
                                </p>
                            </div>

                        </div>
                    </div>

                </div>
            </section>

            {/* How It Works */}
            <section className="max-w-7xl mx-auto px-6 py-12">
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-bold text-slate-900">
                        How It Works
                    </h2>
                    <p className="mt-3 text-slate-500">
                        Three simple steps to improve your learning.
                    </p>
                </div>

                <div className="grid md:grid-cols-3 gap-6">

                    <div className="rounded-2xl bg-white p-6 border border-slate-100 hover:-translate-y-1 transition hover:shadow-lg/80 shadow-indigo-400/70">
                        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-100 text-xl">
                            📤
                        </div>
                        <h3 className="font-bold text-slate-800">
                            Upload
                        </h3>
                        <p className="mt-2 text-sm text-slate-600">
                            Upload a clear image of your test paper from your device.
                        </p>
                    </div>

                    <div className="rounded-2xl bg-white p-6 border border-slate-100 hover:-translate-y-1 transition hover:shadow-lg/80 shadow-indigo-400/70">
                        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-violet-100 text-xl">
                            🧠
                        </div>
                        <h3 className="font-bold text-slate-800">
                            Analyze
                        </h3>
                        <p className="mt-2 text-sm text-slate-600">
                            AI evaluates your answers, understands concepts, and detects mistakes.
                        </p>
                    </div>

                    <div className="rounded-2xl bg-white p-6 border border-slate-100 hover:-translate-y-1 transition hover:shadow-lg/80 shadow-indigo-400/70">
                        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-100 text-xl">
                            🎯
                        </div>
                        <h3 className="font-bold text-slate-800">
                            Improve
                        </h3>
                        <p className="mt-2 text-sm text-slate-600">
                            Receive personalized feedback and actionable suggestions to score better.
                        </p>
                    </div>

                </div>
            </section>

            {/* Features */}
            <section className="max-w-7xl mx-auto px-6 py-16">
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-bold text-slate-900">
                        Why Choose Our Platform?
                    </h2>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">

                    <div className="rounded-2xl bg-white p-5 border border-slate-100 shadow-sm">
                        <div className="text-3xl mb-3">🔍</div>
                        <h3 className="font-semibold text-slate-800">
                            OCR Technology
                        </h3>
                        <p className="mt-2 text-sm text-slate-500">
                            Reads handwritten and printed text accurately.
                        </p>
                    </div>

                    <div className="rounded-2xl bg-white p-5 border border-slate-100 shadow-sm">
                        <div className="text-3xl mb-3">🤖</div>
                        <h3 className="font-semibold text-slate-800">
                            AI Feedback
                        </h3>
                        <p className="mt-2 text-sm text-slate-500">
                            Intelligent analysis with detailed explanations.
                        </p>
                    </div>

                    <div className="rounded-2xl bg-white p-5 border border-slate-100 shadow-sm">
                        <div className="text-3xl mb-3">📊</div>
                        <h3 className="font-semibold text-slate-800">
                            Performance Insights
                        </h3>
                        <p className="mt-2 text-sm text-slate-500">
                            Discover strengths, weaknesses, and improvement areas.
                        </p>
                    </div>

                    <div className="rounded-2xl bg-white p-5 border border-slate-100 shadow-sm">
                        <div className="text-3xl mb-3">🎓</div>
                        <h3 className="font-semibold text-slate-800">
                            Better Learning
                        </h3>
                        <p className="mt-2 text-sm text-slate-500">
                            Learn smarter with personalized study recommendations.
                        </p>
                    </div>

                </div>
            </section>

            {/* CTA */}
            <section className="max-w-5xl mx-auto px-6 pb-20">
                <div className="rounded-3xl bg-linear-to-r from-indigo-600 to-violet-600 p-10 text-center text-white shadow-xl">
                    <h2 className="text-3xl font-bold">
                        Ready to Improve Your Scores?
                    </h2>

                    <p className="mt-3 text-indigo-100">
                        Create your free account and start analyzing your test papers with AI today.
                    </p>

                    <Link
                        to="/register"
                        className="mt-6 inline-block rounded-xl bg-white px-6 py-3 font-semibold text-indigo-700 transition hover:scale-105 hover:shadow-xl/55 hover:shadow-black"
                    >
                        Get Started
                    </Link>
                </div>
            </section>

        </div>
    )
}

export default Home