import React from 'react'

const Integration = () => {
  return (
    <section className="py-20 md:py-32 px-6 relative overflow-hidden">
        {/* Subtle top-right glow */}
        <div className="absolute top-0 right-0 w-[500px] h-[400px] bg-indigo-500/5 blur-[120px] rounded-full pointer-events-none" />

        <div className="max-w-6xl mx-auto relative z-10">
            <div className="grid md:grid-cols-2 gap-12 md:gap-16 items-start">
                {/* Left - Text Content */}
                <div>
                    <h2 className="text-3xl md:text-4xl lg:text-[2.75rem] font-medium text-white mb-5 leading-tight tracking-tight">
                        Drop-in simplicity.
                    </h2>
                    <p className="text-base md:text-lg text-zinc-400 leading-relaxed mb-12 max-w-md">
                        No complex SDKs or user syncing. Just add our script tag and
                        you&apos;re live. We inherit your CSS variables automatically.
                    </p>

                    {/* Steps */}
                    <div className="space-y-0">
                        {/* Step 1 */}
                        <div className="flex items-start gap-4">
                            <div className="flex flex-col items-center">
                                <div className="w-8 h-8 rounded-full border border-zinc-700 bg-zinc-900 flex items-center justify-center text-xs text-zinc-400 font-medium shrink-0">
                                    1
                                </div>
                                <div className="w-px h-8 bg-zinc-800" />
                            </div>
                            <p className="text-sm text-zinc-300 pt-1.5">Scan your documentation URL</p>
                        </div>

                        {/* Step 2 */}
                        <div className="flex items-start gap-4">
                            <div className="flex flex-col items-center">
                                <div className="w-8 h-8 rounded-full border border-zinc-700 bg-zinc-900 flex items-center justify-center text-xs text-zinc-400 font-medium shrink-0">
                                    2
                                </div>
                                <div className="w-px h-8 bg-zinc-800" />
                            </div>
                            <p className="text-sm text-zinc-300 pt-1.5">Copy the embed snippet</p>
                        </div>

                        {/* Step 3 */}
                        <div className="flex items-start gap-4">
                            <div className="flex flex-col items-center">
                                <div className="w-8 h-8 rounded-full border border-zinc-700 bg-zinc-900 flex items-center justify-center text-xs text-zinc-400 font-medium shrink-0">
                                    3
                                </div>
                            </div>
                            <p className="text-sm text-zinc-300 pt-1.5">Auto-resolve tickets</p>
                        </div>
                    </div>
                </div>

                {/* Right - Code Editor */}
                <div className="relative mt-2">
                    <div className="rounded-xl border border-white/10 bg-[#111114] shadow-2xl overflow-hidden">
                        {/* Editor Header */}
                        <div className="flex items-center justify-between px-4 py-3 border-b border-white/5 bg-[#0E0E12]">
                            <div className="flex items-center gap-1.5">
                                <div className="w-3 h-3 rounded-full bg-[#FF5F57]" />
                                <div className="w-3 h-3 rounded-full bg-[#FEBC2E]" />
                                <div className="w-3 h-3 rounded-full bg-[#28C840]" />
                            </div>
                            <span className="text-xs text-zinc-500 font-mono">index.html</span>
                        </div>

                        {/* Editor Body */}
                        <div className="p-5 md:p-6 font-mono text-sm leading-8 min-h-[200px]">
                            <div>
                                <span className="text-zinc-600">&lt;!-- </span>
                                <span className="text-zinc-400">AI Customer Support</span>
                                <span className="text-zinc-600"> --&gt;</span>
                            </div>
                            <div className="mt-2">
                                <span className="text-rose-400">&lt;script</span>
                            </div>
                            <div className="pl-6">
                                <span className="text-purple-400">src</span>
                                <span className="text-zinc-500">=</span>
                                <span className="text-emerald-400">&quot;https://ai-customer-support.vercel.app/init.js&quot;</span>
                            </div>
                            <div className="pl-8">
                                <span className="text-purple-400">data-id</span>
                                <span className="text-zinc-500">=</span>
                                <span className="text-emerald-400">&quot;b7885803-18ca-479b-baf6-c6b289e309a5&quot;</span>
                            </div>
                            <div className="pl-6">
                                <span className="text-purple-400">defer</span>
                                <span className="text-rose-400">&gt;</span>
                            </div>
                            <div className="mt-2">
                                <span className="text-rose-400">&lt;/script&gt;</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>
  )
}

export default Integration