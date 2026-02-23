import Image from "next/image"
import Link from "next/link"
import NavItems from "./NavItems"
import UserDropDown from "./UserDropDown"
const Header = ({user}:{user: User}) => {
  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-neutral-900/95 backdrop-blur">
      <div className="mx-auto flex w-full max-w-7xl items-center gap-4 px-6 py-4">
        {/* Signalist Logo/Brand */}
        <Link href='/' className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-green-400 to-blue-500 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M16 6l2.29 2.29-4.88 4.88-4-4L2 16.59 3.41 18l6-6 4 4 6.3-6.29L22 12V6z"/>
              </svg>
            </div>
            <span className="text-xl font-bold text-white">Signalist</span>
          </div>
        </Link>
        
        {/* Navigation */}
        <nav className="hidden flex-1 justify-center md:flex">
          <NavItems />
        </nav>
        
        {/* User Section */}
        <div className="ml-auto">
          <UserDropDown  user = {user}/>
        </div>
      </div>
    </header>
  )
}

export default Header