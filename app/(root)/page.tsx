import TradingViewWidgets from "@/components/TradingViewWidgets"
import { HEATMAP_WIDGET_CONFIG, MARKET_DATA_WIDGET_CONFIG, MARKET_OVERVIEW_WIDGET_CONFIG, TOP_STORIES_WIDGET_CONFIG } from "@/lib/constants"

const page = () => {
    const scriptUrl = `https://s3.tradingview.com/external-embedding/embed-widget-`;
  return (
    <div className='w-full max-w-7xl mx-auto px-6 py-6'>
        <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
            {/* Left Column - Market Overview and Top Stories */}
            <section className="col-span-1 flex flex-col gap-6">
                {/* Market Overview */}
                <div className="bg-neutral-900/50 rounded-lg border border-white/10 overflow-hidden">
                    <TradingViewWidgets
                    title="Market Overview"
                    scriptUrl={`${scriptUrl}market-overview.js`}
                    config={MARKET_OVERVIEW_WIDGET_CONFIG}
                    className="custom-chart"
                    height={450}/>   
                </div>
                
                {/* Top Stories */}
                <div className="bg-neutral-900/50 rounded-lg border border-white/10 overflow-hidden">
                    <TradingViewWidgets
                    title="Top Stories"
                    scriptUrl={`${scriptUrl}timeline.js`}
                    config={TOP_STORIES_WIDGET_CONFIG}
                    className="custom-chart"
                    height={500}/>   
                </div>
            </section>

            {/* Right Column - Stock Heatmap and Market Data */}
            <section className="lg:col-span-2 flex flex-col gap-6">
                {/* Stock Heatmap */}
                <div className="bg-neutral-900/50 rounded-lg border border-white/10 overflow-hidden">
                    <TradingViewWidgets
                    title="Stock Heatmap"
                    scriptUrl={`${scriptUrl}stock-heatmap.js`}
                    config={HEATMAP_WIDGET_CONFIG}
                    className="custom-chart"
                    height={420}/> 
                </div>
                
                {/* Market Data Table */}
                <div className="bg-neutral-900/50 rounded-lg border border-white/10 overflow-hidden">
                    <TradingViewWidgets
                    scriptUrl={`${scriptUrl}market-quotes.js`}
                    config={MARKET_DATA_WIDGET_CONFIG}
                    className="custom-chart"
                    height={420}/> 
                </div>
            </section>
        </div>
    </div>
  )
}

export default page 