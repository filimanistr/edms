"use client"

import { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown, MoreHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"
import internal from "node:stream";

// Note: Columns are where you define the core of what your table will look like.
// They define the data that will be displayed, how it will be formatted, sorted and filtered.


// This type is used to define the shape of our data.
export type Contract = {
  id: number
  template__name: string
  counterparty__name: string
  template__id: number
  status: "ожидает согласования заказчиком" | "ожидает согласование поставщиком" | "согласован"
  year: number
}

export type Service = {
  id: number
  name: string
  amount: number
  year: number
}


export const columns: ColumnDef<Contract>[] = [
  {
    accessorKey: "id",
    header: "#",
    cell: ({ row }) => row.index + 1
  },
  {
    accessorKey: "template__name",
    header: "Название",
  },
  {
    accessorKey: "counterparty__name",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Контрагент
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
  },
  {
    accessorKey: "template__id",
    header: "Шаблон",
  },
  {
    accessorKey: "status",
    header: "Статус",
  },
  {
    accessorKey: "year",
    header: "Год",
  },
]



export const templatesColumns: ColumnDef<Contract>[] = [
  {
    accessorKey: "id",
    header: "#",
    cell: ({ row }) => row.index + 1
  },
  {
    accessorKey: "name",
    header: "Название",
  },
  {
    accessorKey: "service__name",
    header: "Услуга",
  },
]



/* TODO: Форматированный вывод цены, добавили знак валюты, отредактировать потом */

export const servicesColumns: ColumnDef<Service>[] = [
  {
    accessorKey: "id",
    header: "#",
  },
  {
    accessorKey: "name",
    header: "Наименование",
  },
  {
    accessorKey: "amount",
    header: () => <div className="text-right">Цена</div>,
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("amount"))
      const formatted = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(amount)

      return <div className="text-right font-medium">{formatted}</div>
    },
  },
  {
    accessorKey: "year",
    header: "Год",
  },
]
