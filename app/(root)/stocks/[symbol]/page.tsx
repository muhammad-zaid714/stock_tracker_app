import TradingViewWidget from "@/components/TradingViewWidgets";
import WatchlistButton from "@/components/WatchlistButton";
import {
  SYMBOL_INFO_WIDGET_CONFIG,
  CANDLE_CHART_WIDGET_CONFIG,
  BASELINE_WIDGET_CONFIG,
  TECHNICAL_ANALYSIS_WIDGET_CONFIG,
  COMPANY_PROFILE_WIDGET_CONFIG,
  COMPANY_FINANCIALS_WIDGET_CONFIG,
} from "@/lib/constants";

interface StockDetailsProps {
  params: Promise<{
    symbol: string;
  }>;
}

export default async function StockDetails({ params }: StockDetailsProps) {
  const { symbol } = await params;
  const upperSymbol = symbol.toUpperCase();

  return (
    <div className="relative min-h-screen bg-neutral-950 p-6 animate-fadeIn overflow-hidden">
      {/* Animated Background Elements */}
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-br from-emerald-500/10 to-transparent rounded-full blur-3xl animate-floatSlow"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gradient-to-br from-blue-500/10 to-transparent rounded-full blur-3xl animate-float" style={{animationDelay: '3s'}}></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-br from-purple-500/5 via-transparent to-transparent rounded-full blur-3xl animate-pulse"></div>
      </div>

      <div className="relative z-10 mx-auto max-w-7xl">
        {/* Premium Page Header */}
        <div className="mb-10 animate-slideDown">
          <div className="inline-flex items-center gap-3 mb-4 group cursor-pointer hover:scale-105 transition-transform duration-300">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-400 via-teal-400 to-blue-500 flex items-center justify-center shadow-2xl shadow-emerald-500/30 group-hover:shadow-emerald-500/50 transition-all duration-300 animate-gradient">
              <svg className="w-7 h-7 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M16 6l2.29 2.29-4.88 4.88-4-4L2 16.59 3.41 18l6-6 4 4 6.3-6.29L22 12V6z"/>
              </svg>
            </div>
            <div>
              <h1 className="text-5xl font-black bg-gradient-to-r from-white via-emerald-100 to-teal-200 bg-clip-text text-transparent animate-gradientRotate">{upperSymbol}</h1>
              <div className="flex items-center gap-2 mt-1">
                <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></span>
                <p className="text-gray-400 text-sm">Live stock analysis and insights</p>
              </div>
            </div>
          </div>
        </div>

        {/* 2-Column Grid Layout */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          {/* Left Column */}
          <div className="space-y-8">
            {/* Symbol Info */}
            <div className="group relative animate-slideInLeft" style={{animationDelay: '0.1s'}}>
              <div className="absolute -inset-0.5 bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 rounded-3xl opacity-20 group-hover:opacity-40 blur-xl transition-all duration-500 animate-gradientRotate"></div>
              <div className="relative rounded-3xl border border-white/10 bg-gradient-to-br from-neutral-900/95 to-neutral-800/95 backdrop-blur-xl shadow-2xl overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 via-transparent to-cyan-500/5 group-hover:from-emerald-500/10 group-hover:to-cyan-500/10 transition-all duration-700"></div>
                <div className="absolute top-0 right-0 w-48 h-48 bg-emerald-500/5 rounded-full blur-2xl group-hover:bg-emerald-500/10 transition-all duration-700"></div>
                <TradingViewWidget
                  scriptUrl="https://s3.tradingview.com/external-embedding/embed-widget-symbol-info.js"
                  config={SYMBOL_INFO_WIDGET_CONFIG(symbol)}
                  height={170}
                />
              </div>
            </div>

            {/* Candle Chart */}
            <div className="group relative animate-slideInLeft" style={{animationDelay: '0.2s'}}>
              <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 rounded-3xl opacity-20 group-hover:opacity-40 blur-xl transition-all duration-500 animate-gradientRotate" style={{animationDelay: '1s'}}></div>
              <div className="relative rounded-3xl border border-white/10 bg-gradient-to-br from-neutral-900/95 to-neutral-800/95 backdrop-blur-xl shadow-2xl overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-transparent to-purple-500/5 group-hover:from-blue-500/10 group-hover:to-purple-500/10 transition-all duration-700"></div>
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl group-hover:bg-blue-500/10 transition-all duration-700"></div>
                <TradingViewWidget
                  scriptUrl="https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js"
                  config={CANDLE_CHART_WIDGET_CONFIG(symbol)}
                  height={600}
                />
              </div>
            </div>

            {/* Baseline Chart */}
            <div className="group relative animate-slideInLeft" style={{animationDelay: '0.3s'}}>
              <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-500 via-pink-500 to-rose-500 rounded-3xl opacity-20 group-hover:opacity-40 blur-xl transition-all duration-500 animate-gradientRotate" style={{animationDelay: '2s'}}></div>
              <div className="relative rounded-3xl border border-white/10 bg-gradient-to-br from-neutral-900/95 to-neutral-800/95 backdrop-blur-xl shadow-2xl overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 via-transparent to-rose-500/5 group-hover:from-purple-500/10 group-hover:to-rose-500/10 transition-all duration-700"></div>
                <div className="absolute top-1/2 right-0 w-64 h-64 bg-purple-500/5 rounded-full blur-3xl group-hover:bg-purple-500/10 transition-all duration-700"></div>
                <TradingViewWidget
                  scriptUrl="https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js"
                  config={BASELINE_WIDGET_CONFIG(symbol)}
                  height={600}
                />
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-8">
            {/* Watchlist Button */}
            <div className="animate-slideInRight" style={{animationDelay: '0.4s'}}>
              <div className="relative rounded-3xl border border-white/10 bg-gradient-to-br from-neutral-900/95 to-neutral-800/95 backdrop-blur-xl p-6 shadow-2xl">
                <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/5 to-orange-500/5 rounded-3xl"></div>
                <WatchlistButton symbol={upperSymbol} />
              </div>
            </div>

            {/* Technical Analysis */}
            <div className="group relative animate-slideInRight" style={{animationDelay: '0.5s'}}>
              <div className="absolute -inset-0.5 bg-gradient-to-r from-teal-500 via-emerald-500 to-green-500 rounded-3xl opacity-20 group-hover:opacity-40 blur-xl transition-all duration-500 animate-gradientRotate" style={{animationDelay: '3s'}}></div>
              <div className="relative rounded-3xl border border-white/10 bg-gradient-to-br from-neutral-900/95 to-neutral-800/95 backdrop-blur-xl shadow-2xl overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-teal-500/5 via-transparent to-green-500/5 group-hover:from-teal-500/10 group-hover:to-green-500/10 transition-all duration-700"></div>
                <div className="absolute top-0 left-0 w-48 h-48 bg-teal-500/5 rounded-full blur-2xl group-hover:bg-teal-500/10 transition-all duration-700"></div>
                <TradingViewWidget
                  scriptUrl="https://s3.tradingview.com/external-embedding/embed-widget-technical-analysis.js"
                  config={TECHNICAL_ANALYSIS_WIDGET_CONFIG(symbol)}
                  height={400}
                />
              </div>
            </div>

            {/* Company Profile */}
            <div className="group relative animate-slideInRight" style={{animationDelay: '0.6s'}}>
              <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-500 via-violet-500 to-purple-500 rounded-3xl opacity-20 group-hover:opacity-40 blur-xl transition-all duration-500 animate-gradientRotate" style={{animationDelay: '4s'}}></div>
              <div className="relative rounded-3xl border border-white/10 bg-gradient-to-br from-neutral-900/95 to-neutral-800/95 backdrop-blur-xl shadow-2xl overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 via-transparent to-purple-500/5 group-hover:from-indigo-500/10 group-hover:to-purple-500/10 transition-all duration-700"></div>
                <div className="absolute bottom-0 right-0 w-64 h-64 bg-indigo-500/5 rounded-full blur-3xl group-hover:bg-indigo-500/10 transition-all duration-700"></div>
                <TradingViewWidget
                  scriptUrl="https://s3.tradingview.com/external-embedding/embed-widget-symbol-profile.js"
                  config={COMPANY_PROFILE_WIDGET_CONFIG(symbol)}
                  height={440}
                />
              </div>
            </div>

            {/* Company Financials */}
            <div className="group relative animate-slideInRight" style={{animationDelay: '0.7s'}}>
              <div className="absolute -inset-0.5 bg-gradient-to-r from-rose-500 via-pink-500 to-fuchsia-500 rounded-3xl opacity-20 group-hover:opacity-40 blur-xl transition-all duration-500 animate-gradientRotate" style={{animationDelay: '5s'}}></div>
              <div className="relative rounded-3xl border border-white/10 bg-gradient-to-br from-neutral-900/95 to-neutral-800/95 backdrop-blur-xl shadow-2xl overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-rose-500/5 via-transparent to-fuchsia-500/5 group-hover:from-rose-500/10 group-hover:to-fuchsia-500/10 transition-all duration-700"></div>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-rose-500/5 rounded-full blur-3xl group-hover:bg-rose-500/10 transition-all duration-700"></div>
                <TradingViewWidget
                  scriptUrl="https://s3.tradingview.com/external-embedding/embed-widget-financials.js"
                  config={COMPANY_FINANCIALS_WIDGET_CONFIG(symbol)}
                  height={464}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
