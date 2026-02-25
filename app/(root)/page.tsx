import TradingViewWidgets from "@/components/TradingViewWidgets"
import { HEATMAP_WIDGET_CONFIG, MARKET_DATA_WIDGET_CONFIG, MARKET_OVERVIEW_WIDGET_CONFIG, TOP_STORIES_WIDGET_CONFIG } from "@/lib/constants"

const page = () => {
    const scriptUrl = `https://s3.tradingview.com/external-embedding/embed-widget-`;
  return (
    <div className='relative w-full max-w-7xl mx-auto px-6 py-8 animate-fadeIn'>
        {/* Floating Gradient Orbs */}
        <div className="fixed top-20 left-10 w-96 h-96 bg-gradient-to-br from-emerald-500/10 via-teal-500/10 to-transparent rounded-full blur-3xl animate-floatSlow pointer-events-none"></div>
        <div className="fixed bottom-20 right-10 w-96 h-96 bg-gradient-to-br from-blue-500/10 via-purple-500/10 to-transparent rounded-full blur-3xl animate-float pointer-events-none" style={{animationDelay: '2s'}}></div>
        
        {/* Premium Header */}
        <div className="mb-12 animate-slideDown relative z-10">
            <div className="inline-block mb-3">
                <span className="text-sm font-semibold tracking-wider text-emerald-400 uppercase bg-emerald-500/10 px-4 py-1.5 rounded-full border border-emerald-500/20 backdrop-blur-sm">Live Market Data</span>
            </div>
            <h1 className="text-5xl md:text-6xl font-black mb-4">
                <span className="bg-gradient-to-r from-white via-emerald-100 to-teal-200 bg-clip-text text-transparent drop-shadow-2xl animate-gradientRotate inline-block">
                    Market Dashboard
                </span>
            </h1>
            <p className="text-lg text-gray-400 flex items-center gap-2">
                <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></span>
                Real-time insights and market analysis
            </p>
        </div>

        <div className='grid grid-cols-1 lg:grid-cols-3 gap-8 relative z-10'>
            {/* Left Column */}
            <section className="col-span-1 flex flex-col gap-8">
                {/* Market Overview */}
                <div className="group relative animate-scaleIn" style={{animationDelay: '0.1s'}}>
                    <div className="absolute -inset-0.5 bg-gradient-to-r from-emerald-500 via-teal-500 to-blue-500 rounded-3xl opacity-20 group-hover:opacity-40 blur-xl transition-all duration-500 animate-gradientRotate"></div>
                    <div className="relative bg-gradient-to-br from-neutral-900/95 to-neutral-800/95 rounded-3xl border border-white/10 overflow-hidden shadow-2xl backdrop-blur-xl">
                        <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 via-transparent to-blue-500/5 group-hover:from-emerald-500/10 group-hover:to-blue-500/10 transition-all duration-700"></div>
                        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 rounded-full blur-3xl group-hover:bg-emerald-500/10 transition-all duration-700"></div>
                        <TradingViewWidgets
                        title="Market Overview"
                        scriptUrl={`${scriptUrl}market-overview.js`}
                        config={MARKET_OVERVIEW_WIDGET_CONFIG}
                        className="custom-chart"
                        height={450}/>   
                    </div>
                </div>
                
                {/* Top Stories */}
                <div className="group relative animate-scaleIn" style={{animationDelay: '0.2s'}}>
                    <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-3xl opacity-20 group-hover:opacity-40 blur-xl transition-all duration-500 animate-gradientRotate" style={{animationDelay: '1s'}}></div>
                    <div className="relative bg-gradient-to-br from-neutral-900/95 to-neutral-800/95 rounded-3xl border border-white/10 overflow-hidden shadow-2xl backdrop-blur-xl">
                        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-transparent to-purple-500/5 group-hover:from-blue-500/10 group-hover:to-purple-500/10 transition-all duration-700"></div>
                        <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl group-hover:bg-blue-500/10 transition-all duration-700"></div>
                        <TradingViewWidgets
                        title="Top Stories"
                        scriptUrl={`${scriptUrl}timeline.js`}
                        config={TOP_STORIES_WIDGET_CONFIG}
                        className="custom-chart"
                        height={500}/>   
                    </div>
                </div>
            </section>

            {/* Right Column */}
            <section className="lg:col-span-2 flex flex-col gap-8">
                {/* Stock Heatmap */}
                <div className="group relative animate-scaleIn" style={{animationDelay: '0.3s'}}>
                    <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-500 via-pink-500 to-rose-500 rounded-3xl opacity-20 group-hover:opacity-40 blur-xl transition-all duration-500 animate-gradientRotate" style={{animationDelay: '2s'}}></div>
                    <div className="relative bg-gradient-to-br from-neutral-900/95 to-neutral-800/95 rounded-3xl border border-white/10 overflow-hidden shadow-2xl backdrop-blur-xl">
                        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 via-transparent to-pink-500/5 group-hover:from-purple-500/10 group-hover:to-pink-500/10 transition-all duration-700"></div>
                        <div className="absolute top-0 left-1/2 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl group-hover:bg-purple-500/10 transition-all duration-700"></div>
                        <TradingViewWidgets
                        title="Stock Heatmap"
                        scriptUrl={`${scriptUrl}stock-heatmap.js`}
                        config={HEATMAP_WIDGET_CONFIG}
                        className="custom-chart"
                        height={420}/> 
                    </div>
                </div>
                
                {/* Market Data Table */}
                <div className="group relative animate-scaleIn" style={{animationDelay: '0.4s'}}>
                    <div className="absolute -inset-0.5 bg-gradient-to-r from-teal-500 via-emerald-500 to-green-500 rounded-3xl opacity-20 group-hover:opacity-40 blur-xl transition-all duration-500 animate-gradientRotate" style={{animationDelay: '3s'}}></div>
                    <div className="relative bg-gradient-to-br from-neutral-900/95 to-neutral-800/95 rounded-3xl border border-white/10 overflow-hidden shadow-2xl backdrop-blur-xl">
                        <div className="absolute inset-0 bg-gradient-to-br from-teal-500/5 via-transparent to-emerald-500/5 group-hover:from-teal-500/10 group-hover:to-emerald-500/10 transition-all duration-700"></div>
                        <div className="absolute bottom-0 right-0 w-96 h-96 bg-teal-500/5 rounded-full blur-3xl group-hover:bg-teal-500/10 transition-all duration-700"></div>
                        <TradingViewWidgets
                        scriptUrl={`${scriptUrl}market-quotes.js`}
                        config={MARKET_DATA_WIDGET_CONFIG}
                        className="custom-chart"
                        height={420}/> 
                    </div>
                </div>
            </section>
        </div>
    </div>
  )
}

export default page 