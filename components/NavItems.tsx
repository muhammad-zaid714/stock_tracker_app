"use client"
import { NAV_ITEMS } from "@/lib/constants"
import Link from "next/link"
import { usePathname } from "next/navigation"


const NavItems = () => {
  const pathName: string = usePathname();
  const isActive = (path: string) => pathName === path;

  return (
    <ul className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-10 p-2 font-medium">
      {NAV_ITEMS.map(({ href, label }) => (
        <li key={href}>
          <Link
            href={href}
            className={`transition-colors duration-300 hover:text-yellow-500 ${isActive(href) ? "text-yellow-500" : "text-gray-400"}`}
          >
            {label}
          </Link>
        </li>
      ))}
    </ul>
  )
}

export default NavItems