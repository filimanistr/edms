import Link from "next/link"
import { Package2 } from "lucide-react"
import { ModeToggle } from "@/components/mode-toggle"
import AccountMenu from "@/components/AccountMenu"

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
          <div className="ml-auto text-muted-foreground"></div>
          <ModeToggle/>
          <AccountMenu/>
        </div>
      </div>
    </header>
  )
}
