/* UI */
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import Link from "next/link"
import { CircleUser, Package2, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ModeToggle } from "@/components/mode-toggle"
import { CreateWindow } from "@/components/windows"

/* Requests */
import { createNewContract } from "@/tokens"


export default function Header({page, data, setData}) {

  return (
      <header className="sticky items-center gap-4 border-b bg-background px-4">
        <div className="flex top-0 h-16 max-w-7xl mx-auto">
        <nav className="hidden flex-col gap-6 text-lg font-medium md:flex md:flex-row md:items-center md:gap-5 md:text-sm lg:gap-6">

          {/* Лого */}
          <Link
            href="/"
            className="flex items-center gap-2 text-lg font-semibold md:text-base"
          >
            <Package2 className="h-6 w-6"/>
            <span className="sr-only">Acme Inc</span>
          </Link>

          {/* Кнопки */}
          <Link
            href="contracts"
            className={page === "/contracts"
                ? "text-foreground transition-colors hover:text-foreground"
                : "text-muted-foreground transition-colors hover:text-foreground"
            }
          >
            Договора
          </Link>
          <Link
            href="templates"
            className={page === "/templates"
              ? "text-foreground transition-colors hover:text-foreground"
              : "text-muted-foreground transition-colors hover:text-foreground"
            }
          >
            Шаблоны
          </Link>
          <Link
            href="counterparties"
            className={page === "/counterparties"
              ? "text-foreground transition-colors hover:text-foreground"
              : "text-muted-foreground transition-colors hover:text-foreground"
            }
          >
            Контрагенты
          </Link>
          <Link
            href="services"
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
            <CreateWindow page={page} data={data} setData={setData}>
              <Button variant="ghost" size="sm">
                Новый
              </Button>
            </CreateWindow>
          </div>

          {/* Строка поиска */}
          <form className="flex-1 sm:flex-initial ">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground"/>
              <Input
                type="search"
                placeholder="Поиск"
                className="pl-8 sm:w-[300px] md:w-[200px] lg:w-[300px]"
              />
            </div>
          </form>

          {/* Изменеие темы */}
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