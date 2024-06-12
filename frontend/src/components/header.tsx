import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import Link from "next/link"
import { CircleUser, Package2, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ModeToggle } from "@/components/mode-toggle"

export default async function Header({ page='/', is_admin = false}) {
  return (
      <header className="top-0 z-10 items-center gap-4 border-b bg-background px-24">
        <div className="flex top-0 h-16 max-w-7xl mx-auto">
        <nav className="hidden flex-col gap-6 text-lg font-medium md:flex md:flex-row md:items-center md:gap-5 md:text-sm lg:gap-6">
          {/* Лого */}
          <Link
            replace
            href="/"
            className="flex items-center gap-2 text-lg font-semibold md:text-base"
          >
            <Package2 className="h-6 w-6"/>
            <span className="sr-only">Acme Inc</span>
          </Link>
          <Link
            replace
            href="/contracts"
            className={page === "/contracts"
                ? "text-foreground transition-colors hover:text-foreground"
                : "text-muted-foreground transition-colors hover:text-foreground"
            }
          >
            Договоры
          </Link>
          <Link
            replace
            href="/templates"
            className={page === "/templates"
              ? "text-foreground transition-colors hover:text-foreground"
              : "text-muted-foreground transition-colors hover:text-foreground"
            }
          >
            Шаблоны
          </Link>
          {/*
          <Link
            replace
            href="/counterparties"
            className={page === "/counterparties"
              ? "text-foreground transition-colors hover:text-foreground"
              : "text-muted-foreground transition-colors hover:text-foreground"
            }
          >
            Контрагенты
          </Link>
          */}
          <Link
            replace
            href="/services"
            className={page === "/services"
              ? "text-foreground transition-colors hover:text-foreground"
              : "text-muted-foreground transition-colors hover:text-foreground"
            }
          >
            Услуги
          </Link>
        </nav>

        <div className="flex w-full items-center gap-4 md:ml-auto md:gap-2 lg:gap-4">
          {/* Новый объект */}
          <div className="ml-auto text-muted-foreground">

          </div>

          {/* Строка поиска */} {/*
          <form className="flex-1 sm:flex-initial ">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground"/>
              <Input
                type="search"
                placeholder="Поиск"
                className="pl-8 sm:w-[300px] md:w-[200px] lg:w-[300px] focus-visible:ring-1 focus-visible:ring-ring focus-visible:ring-offset-0 "
              />
            </div>
          </form> */}

          {/* Изменение темы */}
          <ModeToggle/>

          {/* Аккаунт */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="secondary" size="icon" className="rounded-full">
                <CircleUser className="h-5 w-5"/>
                <span className="sr-only">Toggle user menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator/>
              <DropdownMenuItem>Settings</DropdownMenuItem>
              <DropdownMenuItem>Support</DropdownMenuItem>
              <DropdownMenuSeparator/>
              <DropdownMenuItem>Logout</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        </div>
      </header>
  )
}