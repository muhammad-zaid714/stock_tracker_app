import Link from "next/link"
import Image from "next/image"
import { ReactNode } from "react"

const layout = ({children}: {children: ReactNode}) => {
  return (
    <main className="auth-layout">
        <section className="auth-left-section scrollbar-hide-default">
            <Link href="/" className="auth-logo">
            <Image src="/assets/icons/logo.svg" alt="Signalist Logo" width={150} height={32} className="h-8 w-auto" />
            </Link>
            <div className="pb-6 lg:pb-8 flex-1 ">
                {children}
            </div>
        </section>
        <section className="auth-right-section">
            <div className="z-10 relative lg:mt-8">
                <blockquote className="auth-blockquote">
                   Signalist turned my watchlist into a winning list. The alerts are spot-on, and I feel more confident making moves in the market
                </blockquote>
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <cite className="auth-testimonial-author">
                            — Ethan R.
                        </cite>
                        <p className="max-md:text-sm text-gray-500 mb-2">Retail Investor</p>
                        <div className="flex items-center gap-0.5">
                            {[1,2,3,4,5].map((_,index) => (
                                <svg key={index} width="16" height="16" viewBox="0 0 24 24" fill="#FDD458" className="h-4 w-4">
                                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                                </svg>
                            ))}
                        </div>
                    </div>
                </div>
                <div className="mt-8">
                    <Image 
                        src="/assets/images/dashboard.png" 
                        alt="Signalist Dashboard Preview" 
                        width={1024} 
                        height={600} 
                        className="border-2 border-gray-600 hidden w-full h-auto max-w-none lg:block rounded-xl shadow-2xl object-cover object-top" 
                    />
                </div>
            </div>
        </section>
    </main>
  )
}

export default layout