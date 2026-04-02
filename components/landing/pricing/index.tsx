import { Check } from 'lucide-react'
import Link from 'next/link'
import React from 'react'

const Pricing = () => {
  return (
    <section className="py-20 md:py-32 px-6">
        <div className="max-w-4xl mx-auto">
            {/* Header */}
            <div className="text-center mb-14">
                <h2 className="text-3xl md:text-5xl font-medium text-white mb-4 tracking-tight">
                    Fair, usage-based pricing.
                </h2>
                <p className="text-base md:text-lg text-zinc-500">
                    Start free, upgrade as you grow.
                </p>
            </div>

            {/* Pricing Cards */}
            <div className="grid md:grid-cols-2 gap-6 md:gap-8">
                {/* Starter Plan */}
                <div className="rounded-2xl border border-white/10 bg-zinc-900/40 p-7 md:p-8 flex flex-col">
                    <div className="mb-6">
                        <h3 className="text-lg text-zinc-300 font-medium mb-4">Starter</h3>
                        <div className="flex items-baseline gap-1.5">
                            <span className="text-5xl font-semibold text-white tracking-tight">$0</span>
                            <span className="text-base text-zinc-500 font-normal">/mo</span>
                        </div>
                    </div>

                    <div className="space-y-4 mb-10 flex-1">
                        <div className="flex items-center gap-3">
                            <Check className="w-4 h-4 text-zinc-500 shrink-0" />
                            <span className="text-sm text-zinc-300">100 conversations/mo</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <Check className="w-4 h-4 text-zinc-500 shrink-0" />
                            <span className="text-sm text-zinc-300">1 Knowledge Source</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <Check className="w-4 h-4 text-zinc-500 shrink-0" />
                            <span className="text-sm text-zinc-300">Community Support</span>
                        </div>
                    </div>

                    <Link
                        href="/api/auth"
                        className="w-full py-3 rounded-full border border-white/15 bg-zinc-800/60 text-white text-sm font-medium text-center hover:bg-zinc-700/60 transition-colors"
                    >
                        Start Free
                    </Link>
                </div>

                {/* Pro Plan */}
                <div className="rounded-2xl border border-white/15 bg-zinc-900/60 p-7 md:p-8 flex flex-col relative overflow-hidden">
                    {/* Popular Badge */}
                    <div className="absolute top-4 right-4">
                        <span className="px-3 py-1 rounded-md bg-zinc-700/80 text-[11px] font-semibold text-zinc-300 uppercase tracking-wider">
                            Popular
                        </span>
                    </div>

                    <div className="mb-6">
                        <h3 className="text-lg text-indigo-400 font-medium mb-4">Pro</h3>
                        <div className="flex items-baseline gap-1.5">
                            <span className="text-5xl font-semibold text-white tracking-tight">$49</span>
                            <span className="text-base text-zinc-500 font-normal">/mo</span>
                        </div>
                    </div>

                    <div className="space-y-4 mb-10 flex-1">
                        <div className="flex items-center gap-3">
                            <Check className="w-4 h-4 text-indigo-400 shrink-0" />
                            <span className="text-sm text-zinc-300">unlimited conversations</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <Check className="w-4 h-4 text-indigo-400 shrink-0" />
                            <span className="text-sm text-zinc-300">unlimited Knowledge Sources</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <Check className="w-4 h-4 text-indigo-400 shrink-0" />
                            <span className="text-sm text-zinc-300">Community Support</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <Check className="w-4 h-4 text-indigo-400 shrink-0" />
                            <span className="text-sm text-zinc-300">Custom Branding</span>
                        </div>
                    </div>

                    <Link
                        href="/api/auth"
                        className="w-full py-3 rounded-full bg-white text-black text-sm font-medium text-center hover:bg-zinc-200 transition-colors"
                    >
                        Get Started
                    </Link>
                </div>
            </div>
        </div>
    </section>
  )
}

export default Pricing