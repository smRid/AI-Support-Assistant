import { Show, SignInButton, SignUpButton, UserButton } from "@clerk/nextjs";
import Link from 'next/link'
import { clerkSignInRedirectProps, clerkSignUpRedirectProps } from "@/lib/clerk";

const Navbar = () => {
  return (
    <nav className='fixed top-0 inset-x-0 z-50 transition-all duration-300 backdrop-blur-sm border-b border-white/5 bg-[#050509]/50'>
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
            <Link href={"/"} className="flex items-center gap-2">
                <div className="w-5 h-5 bg-white rounded-sm flex items-center justify-center">
                    <div className="w-2.5 h-2.5 bg-black rounded-[1px]"></div>
                </div>
                <span className="text-base font-Inter font-semibold tracking-tight text-white/90">
                    Customer Support
                </span>
            </Link>
            <div className="hidden md:flex items-center gap-8 text-sm font-light text-zinc-400">
                <Link href="#features" className="hover:text-white transition-colors">
                    Features
                </Link>
                <Link 
                    href="#how-it-works"
                    className="hover:text-white transition-colors"
                >
                    Integration
                </Link>
                <Link href="#pricing" className="hover:text-white transition-colors">
                    Pricing
                </Link>

                <div className="flex items-center gap-4">
                    <Show when="signed-out">
                        <SignInButton {...clerkSignInRedirectProps}>
                            <a
                                href="/api/auth?intent=sign-in"
                                className="text-xs font-medium text-zinc-400 hover:text-white transition-colors"
                            >
                                Sign in
                            </a>
                        </SignInButton>
                        <SignUpButton {...clerkSignUpRedirectProps}>
                            <a
                                href="/api/auth?intent=sign-up"
                                className="text-xs font-medium bg-white text-black px-4 py-2 hover:bg-zinc-200 transition-colors border-white/10 rounded-full"
                            >
                                Get started
                            </a>
                        </SignUpButton>
                    </Show>
                    <Show when="signed-in">
                        <UserButton />
                    </Show>
                </div>
            </div>
        </div>
    </nav>
  )
}

export default Navbar
