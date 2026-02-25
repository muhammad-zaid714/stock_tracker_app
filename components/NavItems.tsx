"use client"
import { NAV_ITEMS } from "@/lib/constants"
import Link from "next/link"
import { usePathname } from "next/navigation"
import SearchCommand from "./SearchCommand"


const NavItems = ({initialStocks}:{initialStocks: StockWithWatchlistStatus[]}) => {
  const pathName: string = usePathname();
  const isActive = (path: string) => pathName === path;
  const SearchCommandAny: any = SearchCommand;

  return (
    <ul className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-8 p-2 font-medium">
      {NAV_ITEMS.map(({ href, label }) => {
        if(label === 'Search')return(
          <li key='search-trigger' className="group">
            <div className="relative inline-block">
              <SearchCommandAny
                renderAs='text'
                label="Search"
                initialStocks={initialStocks}
              />
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-linear-to-r from-emerald-400 to-blue-400 transition-all duration-300 group-hover:w-full"></span>
            </div>
          </li>
        )
       return <li key={href} className="group relative">
          <Link
            href={href}
            className={`relative transition-all duration-300 ${
              isActive(href) 
                ? "text-transparent bg-clip-text bg-linear-to-r from-emerald-400 to-teal-400 font-semibold" 
                : "text-gray-300 hover:text-white"
            }`}
          >
            {label}
            <span className={`absolute -bottom-1 left-0 h-0.5 bg-linear-to-r from-emerald-400 to-blue-400 transition-all duration-300 ${
              isActive(href) ? 'w-full' : 'w-0 group-hover:w-full'
            }`}></span>
            {isActive(href) && (
              <span className="absolute -inset-x-2 -inset-y-1 bg-linear-to-r from-emerald-500/10 to-blue-500/10 rounded-lg -z-10 animate-pulse"></span>
            )}
          </Link>
        </li>
})}
    </ul>
  )
}

export default NavItems