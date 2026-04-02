import { ArrowRight } from 'lucide-react'
import Link from 'next/link'
import React from 'react'

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
                <Link
                    href="/api/auth"
                    className="flex items-center gap-2 px-8 py-3 rounded-full bg-white text-black font-medium hover:bg-zinc-200 transition-colors"
                >
                    Start for free <ArrowRight className='w-4 h-4'/>
                </Link>
                <Link
                    href="#how-it-works"
                    className="px-8 py-3 rounded-full border border-white/10 bg-white/5 text-white font-medium hover:bg-white/10 transition-colors"
                >
                    View demo
                </Link>
            </div>
        </div>
    </section>
  )
}

export default Hero