import { Show } from "@clerk/nextjs";
import { ArrowRight, Send } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

const Hero = () => {
  return (
    <section className='relative pt-32 pb-20 md:pt-48 md:pb-32 px-6 overflow-hidden'>
        <div className="max-w-4xl mx-auto text-center relative z-20">
           <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/10 bg-white/5 backdrop-blur-md mb-8 animate-float">
            <span className="w-1.5 h-1.5 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.4)]"></span>
            <span className="text-xs text-zinc-300 tracking-wide font-light">
                Version 1.0.0 available now
            </span>
           </div>
           <h1 className="text-5xl md:text-7xl font-medium tracking-tight text-white mb-6 leading-[1.1]">
                Human-friendly support,
                <br />
                <span className="text-zinc-500">powered by AI.</span>
            </h1>
            <p className="text-lg md:text-xl text-zinc-400 max-w-2xl mx-auto mb-10">
                Deploy an AI agent that understands your customers instantly.
                No coding required. Go live in minutes.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
                <Show when="signed-out">
                    <Link
                        href="/api/auth?intent=sign-up"
                        className="flex items-center justify-center gap-2 px-8 py-3 rounded-full bg-white text-black font-medium hover:bg-zinc-200 transition-colors"
                    >
                        Start for free <ArrowRight className='w-4 h-4'/>
                    </Link>
                </Show>
                <Show when="signed-in">
                    <Link
                        href="/auth/callback"
                        className="flex items-center justify-center gap-2 px-8 py-3 rounded-full bg-white text-black font-medium hover:bg-zinc-200 transition-colors"
                    >
                        Continue <ArrowRight className='w-4 h-4'/>
                    </Link>
                </Show>
                <Link
                    href="#how-it-works"
                    className="px-8 py-3 rounded-full border border-white/10 bg-white/5 text-white font-medium hover:bg-white/10 transition-colors"
                >
                    View demo
                </Link>
            </div>

            {/* Floating Chat Interface Visualization */}
            <div className="max-w-3xl mx-auto relative z-10">
                <div className="absolute inset-0 bg-indigo-500/10 blur-[100px] rounded-full pointer-events-none">

                </div>

                <div className="rounded-2xl p-1 md:p-2 relative overflow-hidden ring-1 ring-white/10 bg-[#0a0a0e] shadow-2xl">
                    <div className="flex flex-col h-125 md:h-150 w-full bg-[#0a0a0e] rounded-xl overflow-hidden">
                        <div className="h-14 border-b border-white/5 flex items-center justify-between px-6 bg-[#0E0E12] shrink-0">
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                                <span className="text-sm font-medium text-zinc-300">
                                Customer Support
                                </span>
                            </div>
                        </div>
                        <div className="flex-1 p-5 md:p-6 overflow-y-auto bg-zinc-950/30 space-y-5 text-left">
                            {/* Bot message 1 */}
                            <div className="flex items-start gap-3">
                                <Image 
                                    src="/chatbot_profile.png"
                                    alt="Support Agent"
                                    className="w-9 h-9 rounded-full object-cover shrink-0 mt-0.5"
                                    width={36}
                                    height={36}
                                />
                                <div className="flex flex-col gap-3">
                                    <div className="px-4 py-2.5 rounded-2xl rounded-tl-sm text-sm leading-relaxed bg-white text-zinc-900 w-fit max-w-xs shadow-sm">
                                        Hi there, How can I help you today?
                                    </div>
                                    <div className="flex flex-wrap gap-2">
                                        <span className="px-3 py-1.5 rounded-full border border-zinc-700 bg-zinc-800/60 text-zinc-300 text-xs font-medium cursor-default hover:bg-zinc-700/60 transition-colors">
                                            FAQ
                                        </span>
                                        <span className="px-3 py-1.5 rounded-full border border-zinc-700 bg-zinc-800/60 text-zinc-300 text-xs font-medium cursor-default hover:bg-zinc-700/60 transition-colors">
                                            Pricing
                                        </span>
                                        <span className="px-3 py-1.5 rounded-full border border-zinc-700 bg-zinc-800/60 text-zinc-300 text-xs font-medium cursor-default hover:bg-zinc-700/60 transition-colors">
                                            Support
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* User message */}
                            <div className="flex items-start gap-3 justify-end">
                                <div className="px-4 py-2.5 rounded-2xl rounded-tr-sm text-sm leading-relaxed bg-zinc-800 text-zinc-100 w-fit max-w-xs shadow-sm">
                                    I need some information about your product
                                </div>
                                <div className="w-9 h-9 rounded-full bg-zinc-700 shrink-0 mt-0.5 flex items-center justify-center">
                                    <svg className="w-4 h-4 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
                                    </svg>
                                </div>
                            </div>

                            {/* Bot message 2 */}
                            <div className="flex items-start gap-3">
                                <Image 
                                    src="/chatbot_profile.png"
                                    alt="Support Agent"
                                    className="w-9 h-9 rounded-full object-cover shrink-0 mt-0.5"
                                    width={36}
                                    height={36}
                                />
                                <div className="px-4 py-2.5 rounded-2xl rounded-tl-sm text-sm leading-relaxed bg-white text-zinc-900 w-fit max-w-sm shadow-sm">
                                    Our AI-powered chatbot helps businesses deliver instant, 24/7 customer support with smart responses and seamless integrations.
                                </div>
                            </div>
                        </div>
                        <div className="p-4 bg-[#0A0A0E] border-t border-white/5 shrink-0">
                            <div className="relative">
                                <div className="min-h-12.5 w-full px-4 py-3 text-sm bg-zinc-900/50 border border-white/10 rounded-xl text-zinc-500 flex items-center justify-between">
                                    <span>Type a message ... </span>
                                    <button className="h-8 w-8 rounded-lg bg-zinc-800 flex items-center justify-center text-zinc-500 cursor-default">
                                        <Send className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        </div>  
                    </div>
                </div>
            </div>
        </div>
    </section>
  )
}

export default Hero
