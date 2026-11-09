import React from 'react'

const SocialProof = () => {
  return (
    <section className='py-5 md:py-6 px-6 border-t border-white/5 bg-zinc-950/20'>
        <div className="max-w-6xl mx-auto">
            <div className="text-center mb-10">
                <h2 className="text-2xl md:text-3xl font-medium text-zinc-300 mb-4">
                    Trusted by teams worldwide
                </h2>
            </div>

            {/* Logo Cloud */}
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-2 items-center opacity-60">
                {/* Placeholder logos - replace with actual logos */}
                <div className="flex items-center justify-center h-12">
                    <span className="text-2xl font-bold text-zinc-300">Acme</span>
                </div>
                <div className="flex items-center justify-center h-12">
                    <span className="text-2xl font-bold text-zinc-300">Globex</span>
                </div>
                <div className="flex items-center justify-center h-12">
                    <span className="text-2xl font-bold text-zinc-300">Soylent</span>
                </div>
                <div className="flex items-center justify-center h-12">
                    <span className="text-2xl font-bold text-zinc-300">Initech</span>
                </div>
                <div className="flex items-center justify-center h-12">
                    <span className="text-2xl font-bold text-zinc-300">Northstar</span>
                </div>
                <div className="flex items-center justify-center h-12">
                    <span className="text-2xl font-bold text-zinc-300">Umbrella</span>
                </div>
            </div>
        </div>
    </section>
  )
}

export default SocialProof
