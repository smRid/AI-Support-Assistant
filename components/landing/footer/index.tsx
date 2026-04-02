import Link from 'next/link'

const Footer = () => {
  return (
    <footer className="border-t border-white/5 py-6 px-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
            {/* Left - Brand */}
            <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-md border border-white/20 flex items-center justify-center">
                    <div className="w-2.5 h-2.5 rounded-sm bg-white" />
                </div>
                <span className="text-sm font-medium text-white">OneMinute Support</span>
            </div>

            {/* Center - Links */}
            <div className="flex items-center gap-6">
                <Link href="/privacy" className="text-sm text-zinc-500 hover:text-zinc-300 transition-colors">
                    Privacy
                </Link>
                <Link href="/terms" className="text-sm text-zinc-500 hover:text-zinc-300 transition-colors">
                    Terms
                </Link>
                <Link href="https://twitter.com" target="_blank" className="text-sm text-zinc-500 hover:text-zinc-300 transition-colors">
                    Twitter
                </Link>
            </div>

            {/* Right - Copyright */}
            <p className="text-sm text-zinc-600">
                © 2026. All rights reserved.
            </p>
        </div>
    </footer>
  )
}

export default Footer