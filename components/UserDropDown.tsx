"use client"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";
import NavItems from "./NavItems";
import { signOut } from "@/lib/actions/auth.actions";

const UserDropDown = ({user}:{user:User}) => {
    const router = useRouter();
    const handleSignOut = async () => {
        const result = await signOut();
        if (result?.success !== false) {
            router.push('/sign-in');
        }
    }
  return (
    <DropdownMenu>
  <DropdownMenuTrigger asChild>
    <Button variant="ghost" className="flex items-center gap-3 text-gray-300 hover:text-green-400">
        <Avatar className="h-8 w-8">
  <AvatarImage src="https://github.com/shadcn.png" />
  <AvatarFallback className="text-white bg-green-500 text-sm font-bold">{user.name[0]}</AvatarFallback>
</Avatar>
  <div className="hidden md:flex flex-col items-start">
    <span className="text-base font-medium text-gray-300">{user.name}</span>
  </div>
    </Button>
  </DropdownMenuTrigger>
  <DropdownMenuContent className="text-gray-300">
    <DropdownMenuLabel>
        <div className="flex relative items-center gap-3 py-2">
    <Avatar className="h-10 w-10">
  <AvatarImage src="https://github.com/shadcn.png" />
  <AvatarFallback className="text-white bg-green-500 text-sm font-bold">{user.name[0]}</AvatarFallback>
</Avatar>
<div className="flex flex-col">
    <span className="font-medium text-gray-300 text-base">{user.name}</span>
    <span className="text-sm text-gray-500">{user.email}</span>
</div>
   </div>
    </DropdownMenuLabel>
    <DropdownMenuSeparator className="bg-gray-600" />
      <DropdownMenuItem onClick={handleSignOut} className="text-gray-100 text-md font-medium focus:bg-transparent focus:text-green-400 transition-colors cursor-pointer">
        <LogOut className="h-4 w-4 mr-2" />
        Sign Out
      </DropdownMenuItem>
      <DropdownMenuItem asChild className="block sm:hidden p-0 focus:bg-transparent">
        <div className="px-2 py-1">
          <NavItems />
        </div>
      </DropdownMenuItem>
  </DropdownMenuContent>
</DropdownMenu>
  )
}

export default UserDropDown