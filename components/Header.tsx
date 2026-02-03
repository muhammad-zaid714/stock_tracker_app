import Image from "next/image"
import Link from "next/link"
import NavItems from "./NavItems"
import UserDropDown from "./UserDropDown"
const Header = () => {
  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-neutral-900">
      <div className="mx-auto flex w-full max-w-6xl items-center gap-4 px-4 py-4 sm:px-6">
        <Link href='/' className="flex items-center gap-3">
          <Image src="/assets/icons/logo.svg" alt="Signalist-logo" width={140} height={32} priority />
        </Link>
        <nav className="hidden flex-1 justify-center sm:flex">
          <NavItems />
        </nav>
        <div className="ml-auto">
          <UserDropDown />
        </div>
      </div>
    </header>
  )
}

export default Header