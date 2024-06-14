"use client"

import {
  DropdownMenu,
  DropdownMenuContent, DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import {Button} from "@/components/ui/button";
import {CircleUser} from "lucide-react";
import {logOut} from "@/app/account/api";

export default function AccountMenu() {

  const handleLogout = async () => {
    await logOut()
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="secondary" size="icon" className="rounded-full">
          <CircleUser className="h-5 w-5"/>
          <span className="sr-only">Toggle user menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Мой аккаунт</DropdownMenuLabel>
        <DropdownMenuSeparator/>
        <DropdownMenuItem>Настройки</DropdownMenuItem>
        <DropdownMenuItem>Поддержка</DropdownMenuItem>
        <DropdownMenuSeparator/>
        <DropdownMenuItem onClick={handleLogout}>Выход</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}