import React from 'react'

const Features = () => {
  return (
    <section className='py-20 md:py-32 px-6 bg-zinc-950/20'>
        <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
                <h2 className="text-3xl md:text-4xl font-medium text-zinc-300 mb-4">
                    Everything you need to scale support
                </h2>
                <p className="text-lg md:text-xl text-zinc-400 max-w-2xl mx-auto">
                    Powerful features designed to make your life easier
                </p>
            </div>

            {/* Feature Grid */}
            <div className="grid md:grid-cols-2 gap-8">
                {/* Feature 1 */}
                <div className="bg-zinc-900/50 p-8 rounded-2xl border border-white/5 hover:border-white/10 transition-colors group">
                    <div className="w-12 h-12 rounded-xl bg-indigo-500/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                        <svg className="w-6 h-6 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2h-5l-5 5v-5z" />
                        </svg>
                    </div>
                    <h3 className="text-xl font-medium text-zinc-300 mb-3">Instant AI Responses</h3>
                    <p className="text-zinc-400 leading-relaxed">
                        Deploy an AI agent that understands natural language and responds instantly to customer queries.
                    </p>
                </div>

                {/* Feature 2 */}
                <div className="bg-zinc-900/50 p-8 rounded-2xl border border-white/5 hover:border-white/10 transition-colors group">
                    <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                        <svg className="w-6 h-6 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 18h.01M8 21h8a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2z" />
                        </svg>
                    </div>
                    <h3 className="text-xl font-medium text-zinc-300 mb-3">No-Code Deployment</h3>
                    <p className="text-zinc-400 leading-relaxed">
                        Go live in minutes without writing a single line of code. Our intuitive interface makes setup a breeze.
                    </p>
                </div>

                {/* Feature 3 */}
                <div className="bg-zinc-900/50 p-8 rounded-2xl border border-white/5 hover:border-white/10 transition-colors group">
                    <div className="w-12 h-12 rounded-xl bg-purple-500/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                        <svg className="w-6 h-6 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                    </div>
                    <h3 className="text-xl font-medium text-zinc-300 mb-3">24/7 Availability</h3>
                    <p className="text-zinc-400 leading-relaxed">
                        Keep your customers happy with round-the-clock support. The AI never sleeps.
                    </p>
                </div>

                {/* Feature 4 */}
                <div className="bg-zinc-900/50 p-8 rounded-2xl border border-white/5 hover:border-white/10 transition-colors group">
                    <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                        <svg className="w-6 h-6 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                    <h3 className="text-xl font-medium text-zinc-300 mb-3">Seamless Handoff</h3>
                    <p className="text-zinc-400 leading-relaxed">
                        When human intervention is needed, the AI seamlessly transfers the conversation to your team.
                    </p>
                </div>
            </div>
        </div>
    </section>
  )
}

export default Features
