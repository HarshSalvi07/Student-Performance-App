import problem from "../assets/problem.png"
import solution from "../assets/solution.png"

function About() {
    return (
        <div className="min-h-screen bg-[#F6F8FC] overflow-hidden">

            {/* ========================================================= */}
            {/* INTRODUCTION */}
            {/* ========================================================= */}
            <section className="min-h-screen flex flex-col items-center">
                <div className="text-[4.5rem] font-semibold uppercase flex justify-center mt-4 bg-linear-to-r from-fuchsia-700 via-violet-400 to-indigo-500 bg-clip-text text-transparent">
                    ABOUT THE SYSTEM</div>
                <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 py-16 sm:py-20">

                    <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">

                        {/* Left */}
                        <div>

                            <h1 className="mt-5 text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight text-slate-900">
                                Turning
                                <span className="block text-indigo-600">
                                    Test Papers
                                </span>
                                Into Learning Insights
                            </h1>

                            <p className="mt-6 max-w-xl text-base sm:text-lg leading-8 text-slate-600">
                                Student Performance Analysis is an AI-powered educational
                                system designed to help students understand their exam
                                performance beyond marks and grades.
                            </p>

                            <p className="mt-4 max-w-xl text-base leading-7 text-slate-500">
                                A student uploads a handwritten or printed test paper.
                                The system reads the answers, analyzes the student's
                                responses, identifies strengths and weaknesses, and
                                generates personalized feedback that can guide future
                                learning.
                            </p>
                        </div>

                        {/* Right - Visualization */}
                        <div className="relative">

                            <div className="absolute -top-10 right-0 h-48 w-48 rounded-full bg-indigo-200/40 blur-3xl"></div>
                            <div className="absolute bottom-0 left-0 h-40 w-40 rounded-full bg-violet-200/40 blur-3xl"></div>

                            <div className="relative rounded-[2rem] border border-slate-200 bg-white p-6 sm:p-8 shadow-2xl">

                                <div className="flex items-center justify-between mb-7">
                                    <div>
                                        <p className="text-xs font-semibold uppercase tracking-wider text-indigo-600">
                                            SYSTEM OVERVIEW
                                        </p>

                                        <h2 className="mt-1 text-xl font-bold text-slate-900">
                                            From Paper to Insight
                                        </h2>
                                    </div>

                                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-100">
                                        🧠
                                    </div>
                                </div>

                                {/* Flow */}
                                <div className="space-y-3">

                                    <div className="flex items-center gap-4 rounded-2xl bg-slate-50 border border-slate-200 p-4">
                                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-indigo-100 text-xl">
                                            📄
                                        </div>

                                        <div>
                                            <p className="font-semibold text-slate-800">
                                                Test Paper
                                            </p>

                                            <p className="text-xs text-slate-500">
                                                Handwritten / Printed
                                            </p>
                                        </div>
                                    </div>

                                    <div className="ml-5 h-5 justify-self-center border-l-2 border-dashed border-indigo-300"></div>

                                    <div className="flex items-center gap-4 rounded-2xl bg-indigo-50 border border-indigo-100 p-4">
                                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-indigo-600 text-xl text-white">
                                            🔍
                                        </div>

                                        <div>
                                            <p className="font-semibold text-slate-800">
                                                OCR Processing
                                            </p>

                                            <p className="text-xs text-slate-500">
                                                Extracting answer text
                                            </p>
                                        </div>
                                    </div>

                                    <div className="ml-5 h-5 justify-self-center border-l-2 border-dashed border-violet-300"></div>

                                    <div className="flex items-center gap-4 rounded-2xl bg-violet-50 border border-violet-100 p-4">
                                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-violet-600 text-xl text-white">
                                            🤖
                                        </div>

                                        <div>
                                            <p className="font-semibold text-slate-800">
                                                AI Reasoning
                                            </p>

                                            <p className="text-xs text-slate-500">
                                                Understanding answers and concepts
                                            </p>
                                        </div>
                                    </div>

                                    <div className="ml-5 h-5 justify-self-center border-l-2 border-dashed border-emerald-300"></div>

                                    <div className="flex items-center gap-4 rounded-2xl bg-emerald-50 border border-emerald-100 p-4">
                                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-600 text-xl text-white">
                                            📊
                                        </div>

                                        <div>
                                            <p className="font-semibold text-slate-800">
                                                Performance Report
                                            </p>

                                            <p className="text-xs text-slate-500">
                                                Personalized learning feedback
                                            </p>
                                        </div>
                                    </div>

                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </section>


            {/* ========================================================= */}
            {/* PROBLEM */}
            {/* ========================================================= */}
            <section className="min-h-screen flex flex-col i bg-slate-100/60 mx-auto w-full max-w-7xl py-6 sm:py-10">
                <div className="text-[4.5rem] px-4 sm:px-6 flex gap-2 items-center mt-4 bg-linear-to-r from-violet-400 via-fuchsia-700 to-indigo-500 bg-clip-text text-transparent">
                    <span>THE PROBLEM</span>
                    <img className="h-30 w-30" src={problem} alt="" />
                </div>
                <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 py-6 sm:py-10">

                    <div className="max-w-3xl">

                        <h2 className="mt-4 text-3xl sm:text-4xl font-bold text-slate-900">
                            Marks Tell You the Result.
                            <span className="block text-indigo-600">
                                They Don't Always Explain It.
                            </span>
                        </h2>

                        <p className="mt-5 text-base sm:text-lg leading-8 text-slate-600">
                            Traditional assessments usually end with a score, grade,
                            or a few written comments. Students may know that they
                            made mistakes, but still struggle to understand why those
                            mistakes happened or what they should study next.
                        </p>
                    </div>

                    {/* Problem cards */}
                    <div className="mt-12 grid md:grid-cols-3 gap-6">

                        <div className="rounded-3xl bg-white border border-slate-200 p-7 shadow-sm">
                            <div className="text-3xl mb-5">❓</div>

                            <h3 className="text-lg font-bold text-slate-800">
                                What Went Wrong?
                            </h3>

                            <p className="mt-3 text-sm leading-7 text-slate-600">
                                Students often see an incorrect answer without
                                understanding the underlying mistake.
                            </p>
                        </div>

                        <div className="rounded-3xl bg-white border border-slate-200 p-7 shadow-sm">
                            <div className="text-3xl mb-5">🧩</div>

                            <h3 className="text-lg font-bold text-slate-800">
                                Which Concept?
                            </h3>

                            <p className="mt-3 text-sm leading-7 text-slate-600">
                                A wrong answer may indicate a deeper misunderstanding
                                of the concept rather than a simple calculation error.
                            </p>
                        </div>

                        <div className="rounded-3xl bg-white border border-slate-200 p-7 shadow-sm">
                            <div className="text-3xl mb-5">🗺️</div>

                            <h3 className="text-lg font-bold text-slate-800">
                                What Next?
                            </h3>

                            <p className="mt-3 text-sm leading-7 text-slate-600">
                                Students need clear guidance about what to practice
                                and how they can improve.
                            </p>
                        </div>

                    </div>

                </div>
            </section>


            {/* ========================================================= */}
            {/* SOLUTION */}
            {/* ========================================================= */}
            <section className="min-h-screen flex flex-col bg-slate-100/60 mx-auto w-full max-w-7xl py-6 sm:py-10">
                <div className="text-[4.5rem] px-4 sm:px-11 uppercase flex gap-5 items-center justify-end mt-4 bg-linear-to-r from-violet-400 via-fuchsia-700 to-indigo-500 bg-clip-text text-transparent">
                    <img className="h-30 w-30" src={solution} alt="" />
                    <span>THE SOLUTION</span>
                </div>
                <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 py-16 sm:py-20">

                    <div className="grid lg:grid-cols-2 gap-12 items-center">

                        {/* Visualization */}
                        <div className="order-2 lg:order-1 rounded-[2rem] bg-white border border-slate-200 p-6 sm:p-8 shadow-xl">

                            <div className="mb-6 flex items-center justify-between">
                                <div>
                                    <p className="text-xs font-semibold uppercase tracking-wider text-indigo-600">
                                        AI FEEDBACK
                                    </p>

                                    <h3 className="mt-1 text-xl font-bold text-slate-900">
                                        Example Analysis
                                    </h3>
                                </div>

                                <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">
                                    Generated
                                </span>
                            </div>

                            <div className="space-y-4">

                                <div className="rounded-2xl border border-emerald-100 bg-emerald-50 p-5">
                                    <div className="flex items-center gap-2">
                                        <span>✅</span>
                                        <h4 className="font-semibold text-emerald-700">
                                            Identified Strength
                                        </h4>
                                    </div>

                                    <p className="mt-2 text-sm leading-6 text-slate-600">
                                        Strong understanding of the core concept and
                                        correct use of fundamental definitions.
                                    </p>
                                </div>

                                <div className="rounded-2xl border border-amber-100 bg-amber-50 p-5">
                                    <div className="flex items-center gap-2">
                                        <span>⚠️</span>
                                        <h4 className="font-semibold text-amber-700">
                                            Concept Gap
                                        </h4>
                                    </div>

                                    <p className="mt-2 text-sm leading-6 text-slate-600">
                                        Formula selection and numerical application
                                        need additional practice.
                                    </p>
                                </div>

                                <div className="rounded-2xl border border-indigo-100 bg-indigo-50 p-5">
                                    <div className="flex items-center gap-2">
                                        <span>💡</span>
                                        <h4 className="font-semibold text-indigo-700">
                                            Improvement
                                        </h4>
                                    </div>

                                    <p className="mt-2 text-sm leading-6 text-slate-600">
                                        Revise the related formulas and solve a small
                                        set of numerical problems before the next test.
                                    </p>
                                </div>

                            </div>
                        </div>

                        {/* Text */}
                        <div className="order-1 lg:order-2">


                            <h2 className="mt-4 text-3xl sm:text-4xl font-bold text-slate-900">
                                From Assessment
                                <span className="block text-indigo-600">
                                    to Action
                                </span>
                            </h2>

                            <p className="mt-6 text-base sm:text-lg leading-8 text-slate-600">
                                The system transforms a static answer sheet into
                                actionable learning information.
                            </p>

                            <div className="mt-8 space-y-5">

                                <div className="flex gap-4">
                                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-sm font-bold text-indigo-600">
                                        1
                                    </div>

                                    <div>
                                        <h3 className="font-bold text-slate-800">
                                            Read the Answers
                                        </h3>

                                        <p className="mt-1 text-sm leading-6 text-slate-500">
                                            OCR processes the uploaded test paper and
                                            extracts its written content.
                                        </p>
                                    </div>
                                </div>

                                <div className="flex gap-4">
                                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-violet-100 text-sm font-bold text-violet-600">
                                        2
                                    </div>

                                    <div>
                                        <h3 className="font-bold text-slate-800">
                                            Understand the Response
                                        </h3>

                                        <p className="mt-1 text-sm leading-6 text-slate-500">
                                            AI evaluates answers and considers the
                                            concepts behind them.
                                        </p>
                                    </div>
                                </div>

                                <div className="flex gap-4">
                                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-sm font-bold text-emerald-600">
                                        3
                                    </div>

                                    <div>
                                        <h3 className="font-bold text-slate-800">
                                            Explain and Recommend
                                        </h3>

                                        <p className="mt-1 text-sm leading-6 text-slate-500">
                                            The final report provides strengths,
                                            weaknesses, mistakes, and improvement guidance.
                                        </p>
                                    </div>
                                </div>

                            </div>

                        </div>

                    </div>

                </div>
            </section>


            {/* ========================================================= */}
            {/* WHAT THE STUDENT RECEIVES */}
            {/* ========================================================= */}
            <section className="min-h-screen flex flex-col items-center bg-slate-100/60 mx-auto w-full max-w-7xl py-6 sm:py-10">
                <div className="text-[4.5rem] px-4 sm:px-11 uppercase flex gap-5 items-center justify-end mt-4 bg-linear-to-r from-violet-400 via-fuchsia-700 to-indigo-500 bg-clip-text text-transparent">
                    THE RESULT
                </div>
                <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 py-6 sm:py-10">

                    <div className="text-center max-w-3xl mx-auto">


                        <h2 className="mt-4 text-3xl sm:text-4xl font-bold text-slate-900">
                            What Students Receive
                        </h2>

                        <p className="mt-4 text-base sm:text-lg leading-7 text-slate-500">
                            Every analysis is designed to provide useful information
                            that students can actually act upon.
                        </p>

                    </div>

                    <div className="mt-12 grid sm:grid-cols-1 lg:grid-cols-2 gap-10">

                        <div className="rounded-3xl bg-white border border-slate-200 p-6 shadow-sm">
                            <div className="flex gap-3 text-3xl mb-4">💪<h3 className="font-bold text-slate-800">
                                Strengths
                            </h3></div>

                            <p className="mt-3 text-sm leading-6 text-slate-500">
                                Understand which concepts and areas you are performing well in.
                            </p>
                        </div>

                        <div className="rounded-3xl bg-white border border-slate-200 p-6 shadow-sm">
                            <div className="flex gap-3 text-3xl mb-4">🔎<h3 className="font-bold text-slate-800">
                                Mistakes
                            </h3></div>



                            <p className="mt-3 text-sm leading-6 text-slate-500">
                                Identify incorrect answers and possible reasons behind them.
                            </p>
                        </div>

                        <div className="rounded-3xl bg-white border border-slate-200 p-6 shadow-sm">
                            <div className="flex gap-3 text-3xl mb-4">🧠<h3 className="font-bold text-slate-800">
                                Concept Gaps
                            </h3></div>



                            <p className="mt-3 text-sm leading-6 text-slate-500">
                                Find topics where deeper understanding or revision may be needed.
                            </p>
                        </div>

                        <div className="rounded-3xl bg-white border border-slate-200 p-6 shadow-sm">
                            <div className="flex gap-3 text-3xl mb-4">🚀<h3 className="font-bold text-slate-800">
                                Next Steps
                            </h3></div>

                            

                            <p className="mt-3 text-sm leading-6 text-slate-500">
                                Get practical suggestions for improving future performance.
                            </p>
                        </div>

                    </div>

                </div>
            </section>


            {/* ========================================================= */}
            {/* TECHNOLOGY */}
            {/* ========================================================= */}
            <section className="min-h-screen flex items-center">
                <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 py-6 sm:py-10">

                    <div className="rounded-[2rem] bg-linear-to-br from-indigo-600 via-violet-600 to-indigo-700 p-7 sm:p-10 lg:p-14 text-white shadow-2xl">

                        <div className="grid lg:grid-cols-2 gap-12 items-center">

                            <div>

                                <p className="text-sm font-semibold uppercase tracking-[0.3em] text-indigo-100">
                                    UNDER THE HOOD
                                </p>

                                <h2 className="mt-4 text-3xl sm:text-4xl font-bold">
                                    Built With Multiple Technologies Working Together
                                </h2>

                                <p className="mt-5 text-sm sm:text-base leading-7 text-indigo-100">
                                    The platform combines frontend development, backend
                                    services, database storage, OCR processing, authentication,
                                    and Artificial Intelligence into one workflow.
                                </p>

                            </div>


                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">

                                <div className="rounded-2xl bg-white/10 border border-white/10 p-5 text-center backdrop-blur-sm">
                                    <p className="text-2xl mb-2">⚛️</p>
                                    <p className="font-semibold">React</p>
                                </div>

                                <div className="rounded-2xl bg-white/10 border border-white/10 p-5 text-center backdrop-blur-sm">
                                    <p className="text-2xl mb-2">🎨</p>
                                    <p className="font-semibold">Tailwind</p>
                                </div>

                                <div className="rounded-2xl bg-white/10 border border-white/10 p-5 text-center backdrop-blur-sm">
                                    <p className="text-2xl mb-2">⚡</p>
                                    <p className="font-semibold">FastAPI</p>
                                </div>

                                <div className="rounded-2xl bg-white/10 border border-white/10 p-5 text-center backdrop-blur-sm">
                                    <p className="text-2xl mb-2">🗄️</p>
                                    <p className="font-semibold">MogngoDB</p>
                                </div>

                                <div className="rounded-2xl bg-white/10 border border-white/10 p-5 text-center backdrop-blur-sm">
                                    <p className="text-2xl mb-2">👁️</p>
                                    <p className="font-semibold">PaddleOCR</p>
                                </div>

                                <div className="rounded-2xl bg-white/10 border border-white/10 p-5 text-center backdrop-blur-sm">
                                    <p className="text-2xl mb-2">🤖</p>
                                    <p className="font-semibold">AI</p>
                                </div>

                            </div>

                        </div>

                    </div>
                    {/* ========================================================= */}
                    {/* CLOSING */}
                    {/* ========================================================= */}
                    <div className="mx-auto w-full max-w-4xl px-4 sm:px-6 py-16 text-center">

                        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-100 text-3xl">
                            🎓
                        </div>

                        <h2 className="mt-6 text-3xl sm:text-4xl font-bold text-slate-900">
                            Built Around One Simple Idea
                        </h2>

                        <p className="mx-auto mt-5 max-w-2xl text-base sm:text-lg leading-8 text-slate-600">
                            A test should not be the end of learning.
                            It should show students where they are,
                            what they understand, and where they can improve.
                        </p>

                        <p className="mt-4 text-lg font-semibold text-indigo-600">
                            Scan • Understand • Improve
                        </p>

                    </div>

                </div>
            </section>



        </div>
    )
}

export default About