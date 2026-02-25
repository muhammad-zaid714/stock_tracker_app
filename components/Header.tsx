import Image from "next/image"
import Link from "next/link"
import NavItems from "./NavItems"
import UserDropDown from "./UserDropDown"
import { searchStocks } from "@/lib/actions/finnhub.actions"
import { getWatchlistSymbolsByUserId } from "@/lib/actions/watchlist.actions"

const Header = async ({user}:{user: User}) => {
  const popularSymbols = ['AAPL', 'MSFT', 'GOOGL', 'AMZN', 'TSLA'];
  
  try {
    const [watchlistSymbols, stockResults] = await Promise.all([
      getWatchlistSymbolsByUserId(user.id),
      Promise.all(popularSymbols.map(symbol => searchStocks(symbol))),
    ]);
    const initialStocks = stockResults
      .map(results => results[0])
      .filter(Boolean)
      .map((stock) => ({
        ...stock,
        isInWatchlist: watchlistSymbols.includes(stock.symbol),
      })) as unknown as StockWithWatchlistStatus[];
    
    return (
      <header className="sticky top-0 z-50 border-b border-white/5 bg-neutral-950/90 backdrop-blur-2xl shadow-2xl">
        {/* Animated Top Border */}
        <div className="absolute top-0 left-0 w-full h-0.5 bg-linear-to-r from-transparent via-emerald-500/50 to-transparent animate-shimmer"></div>
        
        {/* Gradient Orb Background Effects */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-24 left-1/4 w-96 h-96 bg-linear-to-br from-emerald-500/10 via-teal-500/5 to-transparent rounded-full blur-3xl animate-floatSlow"></div>
          <div className="absolute -top-24 right-1/4 w-96 h-96 bg-linear-to-br from-blue-500/10 via-purple-500/5 to-transparent rounded-full blur-3xl animate-float" style={{animationDelay: '2s'}}></div>
        </div>
        
        <div className="relative z-10 mx-auto flex w-full max-w-7xl items-center gap-4 px-6 py-4">
          {/* Signalist Logo/Brand */}
          <Link href='/' className="group flex items-center gap-3 transition-all duration-500 hover:scale-105">
            <div className="flex items-center gap-3">
              {/* Logo with 3D Effect */}
              <div className="relative">
                <div className="absolute inset-0 bg-linear-to-br from-emerald-400 via-teal-400 to-blue-500 rounded-2xl blur-md opacity-50 group-hover:opacity-75 transition-opacity duration-500 animate-pulse"></div>
                <div className="relative w-12 h-12 bg-linear-to-br from-emerald-400 via-teal-400 to-blue-500 rounded-2xl flex items-center justify-center shadow-2xl shadow-emerald-500/30 transition-all duration-500 group-hover:shadow-emerald-500/60 group-hover:rotate-[8deg] animate-gradient overflow-hidden">
                  <div className="absolute inset-0 bg-linear-to-br from-white/20 to-transparent"></div>
                  <svg className="relative z-10 w-7 h-7 text-white drop-shadow-lg" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M16 6l2.29 2.29-4.88 4.88-4-4L2 16.59 3.41 18l6-6 4 4 6.3-6.29L22 12V6z"/>
                  </svg>
                </div>
              </div>
              
              {/* Brand Name with Premium Gradient */}
              <div className="flex flex-col">
                <span className="text-2xl font-black bg-linear-to-r from-white via-emerald-100 to-teal-200 bg-clip-text text-transparent drop-shadow-2xl group-hover:from-emerald-200 group-hover:via-white group-hover:to-teal-300 transition-all duration-500 animate-gradientRotate">
                  Signalist
                </span>
                <span className="text-[10px] font-semibold tracking-widest text-emerald-400/60 uppercase">
                  Live Market Data
                </span>
              </div>
            </div>
          </Link>
          
          {/* Navigation */}
          <nav className="hidden flex-1 justify-center md:flex">
            <NavItems initialStocks={initialStocks} />
          </nav>
          
          {/* User Section */}
          <div className="ml-auto">
            <UserDropDown  user = {user} initialStocks={initialStocks}/>
          </div>
        </div>
      </header>
    );
  } catch (error) {
    console.error('Error fetching trending stocks:', error);
    const emptyStocks: StockWithWatchlistStatus[] = [];
    
    return (
      <header className="sticky top-0 z-50 border-b border-white/5 bg-neutral-950/90 backdrop-blur-2xl shadow-2xl">
        {/* Animated Top Border */}
        <div className="absolute top-0 left-0 w-full h-0.5 bg-linear-to-r from-transparent via-emerald-500/50 to-transparent animate-shimmer"></div>
        
        {/* Gradient Orb Background Effects */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-24 left-1/4 w-96 h-96 bg-linear-to-br from-emerald-500/10 via-teal-500/5 to-transparent rounded-full blur-3xl animate-floatSlow"></div>
          <div className="absolute -top-24 right-1/4 w-96 h-96 bg-linear-to-br from-blue-500/10 via-purple-500/5 to-transparent rounded-full blur-3xl animate-float" style={{animationDelay: '2s'}}></div>
        </div>
        
        <div className="relative z-10 mx-auto flex w-full max-w-7xl items-center gap-4 px-6 py-4">
          {/* Signalist Logo/Brand */}
          <Link href='/' className="group flex items-center gap-3 transition-all duration-500 hover:scale-105">
            <div className="flex items-center gap-3">
              {/* Logo with 3D Effect */}
              <div className="relative">
                <div className="absolute inset-0 bg-linear-to-br from-emerald-400 via-teal-400 to-blue-500 rounded-2xl blur-md opacity-50 group-hover:opacity-75 transition-opacity duration-500 animate-pulse"></div>
                <div className="relative w-12 h-12 bg-linear-to-br from-emerald-400 via-teal-400 to-blue-500 rounded-2xl flex items-center justify-center shadow-2xl shadow-emerald-500/30 transition-all duration-500 group-hover:shadow-emerald-500/60 group-hover:rotate-[8deg] animate-gradient overflow-hidden">
                  <div className="absolute inset-0 bg-linear-to-br from-white/20 to-transparent"></div>
                  <svg className="relative z-10 w-7 h-7 text-white drop-shadow-lg" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M16 6l2.29 2.29-4.88 4.88-4-4L2 16.59 3.41 18l6-6 4 4 6.3-6.29L22 12V6z"/>
                  </svg>
                </div>
              </div>
              
              {/* Brand Name with Premium Gradient */}
              <div className="flex flex-col">
                <span className="text-2xl font-black bg-linear-to-r from-white via-emerald-100 to-teal-200 bg-clip-text text-transparent drop-shadow-2xl group-hover:from-emerald-200 group-hover:via-white group-hover:to-teal-300 transition-all duration-500 animate-gradientRotate">
                  Signalist
                </span>
                <span className="text-[10px] font-semibold tracking-widest text-emerald-400/60 uppercase">
                  Live Market Data
                </span>
              </div>
            </div>
          </Link>
          
          {/* Navigation */}
          <nav className="hidden flex-1 justify-center md:flex">
            <NavItems initialStocks={emptyStocks} />
          </nav>
          
          {/* User Section */}
          <div className="ml-auto">
            <UserDropDown user={user} initialStocks={emptyStocks}/>
          </div>
        </div>
      </header>
    );
  }
}

export default Header;

