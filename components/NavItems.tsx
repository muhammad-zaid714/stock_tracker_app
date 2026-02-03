"use client"
import { NAV_ITEMS } from "@/lib/constants"
import Link from "next/link"
import { usePathname } from "next/navigation"


const NavItems = () => {
  const pathName: string = usePathname();
  const isActive = (path: string) => pathName === path;

  return (
    <ul className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-8 p-2 font-medium">
      {NAV_ITEMS.map(({ href, label }) => (
        <li key={href}>
          <Link
            href={href}
            className={`transition-colors duration-300 hover:text-green-400 ${
              isActive(href) ? "text-green-400" : "text-gray-300"
            }`}
          >
            {label}
          </Link>
        </li>
      ))}
    </ul>
  )
}

export default NavItems